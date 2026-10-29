import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  type Repository,
  VersionColumn,
} from 'typeorm';
import { ConflictError } from '../domain/errors';
import type { NewTransaction, Transaction } from '../domain/transaction.entity';
import type { Wallet } from '../domain/wallet.entity';
import { WalletRepository } from '../domain/wallet.repository';
import { isSqlGuid } from './sql-guid';

@Entity('wallets')
export class WalletRow {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) ownerId: string;
  @Column('decimal', { precision: 19, scale: 2, default: 0 }) balance: number;
  @VersionColumn() version: number;
}

@Entity('transactions')
export class TransactionRow {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index() @Column('uniqueidentifier') walletId: string;
  @Column({ length: 10 }) type: 'deposit' | 'withdrawal';
  @Column('decimal', { precision: 19, scale: 2 }) amount: number;
  @Column('decimal', { precision: 19, scale: 2 }) balanceAfter: number;
  // datetimeoffset keeps the UTC offset; datetime2 was read back as local time and shifted the timestamps
  @CreateDateColumn({ type: 'datetimeoffset' }) createdAt: Date;
}

@Injectable()
export class SqlWalletRepository extends WalletRepository {
  constructor(@InjectRepository(WalletRow) private readonly wallets: Repository<WalletRow>) {
    super();
  }

  async open(ownerId: string): Promise<Wallet> {
    const row = await this.wallets.save(this.wallets.create({ ownerId }));
    return toWallet(row);
  }

  async findAll(): Promise<Wallet[]> {
    return (await this.wallets.find()).map(toWallet);
  }

  async findByOwner(ownerId: string): Promise<Wallet | null> {
    const row = await this.wallets.findOneBy({ ownerId });
    return row && toWallet(row);
  }

  async findById(id: string): Promise<Wallet | null> {
    // A malformed id is an unknown wallet (404), not a conversion error from SQL Server (500)
    if (!isSqlGuid(id)) return null;
    const row = await this.wallets.findOneBy({ id });
    return row && toWallet(row);
  }

  record(wallet: Wallet, entry: NewTransaction): Promise<Transaction> {
    return this.wallets.manager.transaction(async (tx) => {
      // Optimistic check: only update if the balance is still the one the use case validated against
      const { affected } = await tx.update(
        WalletRow,
        { id: wallet.id, balance: wallet.balance },
        { balance: entry.balanceAfter },
      );
      if (!affected) throw new ConflictError(`Wallet ${wallet.id} changed meanwhile, retry`);
      return toTransaction(await tx.save(tx.create(TransactionRow, { walletId: wallet.id, ...entry })));
    });
  }

  remove(wallet: Wallet): Promise<void> {
    return this.wallets.manager.transaction(async (tx) => {
      await tx.delete(TransactionRow, { walletId: wallet.id });
      const { affected } = await tx.delete(WalletRow, { id: wallet.id, balance: wallet.balance });
      if (!affected) throw new ConflictError(`Wallet ${wallet.id} changed meanwhile, retry`);
    });
  }

  async findTransactions(walletId: string): Promise<Transaction[]> {
    const rows = await this.wallets.manager.find(TransactionRow, { where: { walletId }, order: { createdAt: 'DESC' } });
    return rows.map(toTransaction);
  }
}

// SQL DECIMAL comes back as a string, so convert it to number at the edge
const toWallet = (row: WalletRow): Wallet => ({ id: row.id, ownerId: row.ownerId, balance: Number(row.balance) });

const toTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  walletId: row.walletId,
  type: row.type,
  amount: Number(row.amount),
  balanceAfter: Number(row.balanceAfter),
  createdAt: row.createdAt.toISOString(),
});
