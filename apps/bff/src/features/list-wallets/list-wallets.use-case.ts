import type { Wallet } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export type ListWalletsInput = { ownerId?: string };

export class ListWallets {
  constructor(private readonly wallets: WalletService) {}

  execute({ ownerId }: ListWalletsInput): Promise<Wallet[]> {
    return this.wallets.listWallets(ownerId);
  }
}
