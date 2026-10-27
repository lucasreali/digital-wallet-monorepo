import type { Wallet } from './wallet.entity';

// Domain port: use cases depend on it, infrastructure implements it
export abstract class WalletRepository {
  abstract open(ownerId: string): Promise<Wallet>;
  abstract findAll(): Promise<Wallet[]>;
  abstract findByOwner(ownerId: string): Promise<Wallet | null>;
  abstract findById(id: string): Promise<Wallet | null>;
}
