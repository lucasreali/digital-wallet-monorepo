import type { Transaction, Wallet } from './wallet.entity';

// Domain port for svc-carteira: use cases depend on it, infrastructure implements it
export abstract class WalletService {
  abstract listWallets(ownerId?: string): Promise<Wallet[]>;
  abstract getWallet(id: string): Promise<Wallet>;
  abstract openWallet(ownerId: string): Promise<Wallet>;
  abstract deposit(id: string, amount: number): Promise<Wallet>;
  abstract withdraw(id: string, amount: number): Promise<Wallet>;
  abstract closeWallet(id: string): Promise<void>;
  abstract listTransactions(id: string): Promise<Transaction[]>;
}
