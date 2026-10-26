import { Wallet } from '../../domain/wallet.entity';
import { WalletRepository } from '../../domain/wallet.repository';

export class ListWallets {
  constructor(private readonly wallets: WalletRepository) {}

  execute(): Promise<Wallet[]> {
    return this.wallets.findAll();
  }
}
