import { randomUUID } from 'node:crypto';
import { ConflictError } from '../domain/errors';
import type { NewTransaction, Transaction } from '../domain/transaction.entity';
import type { Wallet } from '../domain/wallet.entity';
import { WalletRepository } from '../domain/wallet.repository';

// Test double for use-case specs; keeps unit tests free of SQL Server
export class InMemoryWalletRepository extends WalletRepository {
  wallets: Wallet[] = [];
  transactions: Transaction[] = [];

  async open(ownerId: string): Promise<Wallet> {
    const wallet = { id: randomUUID(), ownerId, balance: 0 };
    this.wallets.push(wallet);
    return wallet;
  }

  async findAll(): Promise<Wallet[]> {
    return this.wallets;
  }

  async findByOwner(ownerId: string): Promise<Wallet | null> {
    return this.wallets.find((w) => w.ownerId === ownerId) ?? null;
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.wallets.find((w) => w.id === id) ?? null;
  }

  async record(wallet: Wallet, entry: NewTransaction): Promise<Transaction> {
    const stored = this.wallets.find((w) => w.id === wallet.id && w.balance === wallet.balance);
    if (!stored) throw new ConflictError(`Wallet ${wallet.id} changed meanwhile`);
    stored.balance = entry.balanceAfter;
    const transaction = { id: randomUUID(), walletId: wallet.id, ...entry, createdAt: new Date().toISOString() };
    this.transactions.push(transaction);
    return transaction;
  }

  async remove(wallet: Wallet): Promise<void> {
    if (!this.wallets.some((w) => w.id === wallet.id && w.balance === wallet.balance)) {
      throw new ConflictError(`Wallet ${wallet.id} changed meanwhile`);
    }
    this.wallets = this.wallets.filter((w) => w.id !== wallet.id);
    this.transactions = this.transactions.filter((t) => t.walletId !== wallet.id);
  }

  async findTransactions(walletId: string): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.walletId === walletId).reverse();
  }
}
