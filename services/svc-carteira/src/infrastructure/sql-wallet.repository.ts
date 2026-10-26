import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, Entity, PrimaryGeneratedColumn, Repository, VersionColumn } from 'typeorm';
import { Wallet } from '../domain/wallet.entity';
import { WalletRepository } from '../domain/wallet.repository';

@Entity('wallets')
export class WalletRow {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) ownerId: string;
  @Column('decimal', { precision: 19, scale: 2, default: 0 }) balance: number;
  @VersionColumn() version: number;
}

@Injectable()
export class SqlWalletRepository extends WalletRepository {
  constructor(@InjectRepository(WalletRow) private readonly wallets: Repository<WalletRow>) {
    super();
  }

  async open(ownerId: string): Promise<Wallet> {
    const row = await this.wallets.save(this.wallets.create({ ownerId }));
    return toDomain(row);
  }

  async findAll(): Promise<Wallet[]> {
    return (await this.wallets.find()).map(toDomain);
  }

  async findByOwner(ownerId: string): Promise<Wallet | null> {
    const row = await this.wallets.findOneBy({ ownerId });
    return row && toDomain(row);
  }
}

const toDomain = (row: WalletRow): Wallet => ({ id: row.id, ownerId: row.ownerId, balance: Number(row.balance) });
