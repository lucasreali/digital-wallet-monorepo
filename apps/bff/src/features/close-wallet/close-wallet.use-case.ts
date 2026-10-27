import type { WalletService } from '../../domain/wallet.service';

export class CloseWallet {
  constructor(private readonly wallets: WalletService) {}

  execute(id: string): Promise<void> {
    return this.wallets.closeWallet(id);
  }
}
