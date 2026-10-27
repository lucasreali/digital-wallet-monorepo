import { randomUUID } from 'node:crypto';
import type { Wallet } from '../domain/wallet.entity';
import { WalletRepository } from '../domain/wallet.repository';

// Test double for use-case specs; keeps unit tests free of SQL Server
export class InMemoryWalletRepository extends WalletRepository {
  wallets: Wallet[] = [];

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
}
