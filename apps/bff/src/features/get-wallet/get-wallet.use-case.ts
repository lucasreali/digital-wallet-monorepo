import type { Wallet } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export class GetWallet {
  constructor(private readonly wallets: WalletService) {}

  execute(id: string): Promise<Wallet> {
    return this.wallets.getWallet(id);
  }
}
