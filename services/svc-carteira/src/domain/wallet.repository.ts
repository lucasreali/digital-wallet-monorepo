import type { NewTransaction, Transaction } from './transaction.entity';
import type { Wallet } from './wallet.entity';

// Domain port: use cases depend on it, infrastructure implements it
export abstract class WalletRepository {
  abstract open(ownerId: string): Promise<Wallet>;
  abstract findAll(): Promise<Wallet[]>;
  abstract findByOwner(ownerId: string): Promise<Wallet | null>;
  abstract findById(id: string): Promise<Wallet | null>;
  /**
   * Atomically sets the balance to entry.balanceAfter and stores the transaction.
   * `wallet` is the state the use case read; throws ConflictError if it changed meanwhile.
   */
  abstract record(wallet: Wallet, entry: NewTransaction): Promise<Transaction>;
  /** Newest first */
  abstract findTransactions(walletId: string): Promise<Transaction[]>;
}
