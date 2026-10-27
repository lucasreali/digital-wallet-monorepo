import type { Wallet } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export type OpenWalletInput = { ownerId: string };

export class OpenWallet {
  constructor(private readonly wallets: WalletService) {}

  execute({ ownerId }: OpenWalletInput): Promise<Wallet> {
    return this.wallets.openWallet(ownerId);
  }
}
