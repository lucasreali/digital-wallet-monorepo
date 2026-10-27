import { randomUUID } from 'node:crypto';
import { ConflictError, DomainError, NotFoundError } from '../domain/errors';
import type { Transaction, Wallet } from '../domain/wallet.entity';
import { WalletService } from '../domain/wallet.service';

// Test double for use-case specs; mimics svc-carteira without HTTP
export class InMemoryWalletService extends WalletService {
  wallets: Wallet[] = [];
  transactions: Transaction[] = [];

  async listWallets(ownerId?: string): Promise<Wallet[]> {
    return this.wallets.filter((w) => !ownerId || w.ownerId === ownerId);
  }

  async getWallet(id: string): Promise<Wallet> {
    const wallet = this.wallets.find((w) => w.id === id);
    if (!wallet) throw new NotFoundError(`Wallet ${id} not found`);
    return wallet;
  }

  async openWallet(ownerId: string): Promise<Wallet> {
    if (this.wallets.some((w) => w.ownerId === ownerId))
      throw new ConflictError(`User ${ownerId} already has a wallet`);
    const wallet = { id: randomUUID(), ownerId, balance: 0 };
    this.wallets.push(wallet);
    return wallet;
  }

  async deposit(id: string, amount: number): Promise<Wallet> {
    return this.move(id, 'deposit', amount);
  }

  async withdraw(id: string, amount: number): Promise<Wallet> {
    return this.move(id, 'withdrawal', amount);
  }

  async closeWallet(id: string): Promise<void> {
    const wallet = await this.getWallet(id);
    if (wallet.balance !== 0) throw new ConflictError('Balance must be zero');
    this.wallets = this.wallets.filter((w) => w.id !== id);
  }

  async listTransactions(id: string): Promise<Transaction[]> {
    await this.getWallet(id);
    return this.transactions.filter((t) => t.walletId === id).reverse();
  }

  private async move(id: string, type: Transaction['type'], amount: number): Promise<Wallet> {
    const wallet = await this.getWallet(id);
    const balanceAfter = wallet.balance + (type === 'deposit' ? amount : -amount);
    if (balanceAfter < 0) throw new DomainError('Insufficient funds');
    wallet.balance = balanceAfter;
    this.transactions.push({
      id: randomUUID(),
      walletId: id,
      type,
      amount,
      balanceAfter,
      createdAt: new Date().toISOString(),
    });
    return wallet;
  }
}
