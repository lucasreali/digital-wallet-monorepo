import type { Transaction } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export class ListTransactions {
  constructor(private readonly wallets: WalletService) {}

  execute(walletId: string): Promise<Transaction[]> {
    return this.wallets.listTransactions(walletId);
  }
}
