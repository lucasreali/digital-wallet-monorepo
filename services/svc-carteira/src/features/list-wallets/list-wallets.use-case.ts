import type { Wallet } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type ListWalletsInput = { ownerId?: string };

export class ListWallets {
  constructor(private readonly wallets: WalletRepository) {}

  async execute({ ownerId }: ListWalletsInput): Promise<Wallet[]> {
    if (!ownerId) return this.wallets.findAll();
    const wallet = await this.wallets.findByOwner(ownerId);
    return wallet ? [wallet] : [];
  }
}
