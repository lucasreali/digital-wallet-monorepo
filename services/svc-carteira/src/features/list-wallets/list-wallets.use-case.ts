import type { Wallet } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export class ListWallets {
  constructor(private readonly wallets: WalletRepository) {}

  execute(): Promise<Wallet[]> {
    return this.wallets.findAll();
  }
}
