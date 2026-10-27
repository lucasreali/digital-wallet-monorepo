import { NotFoundError } from '../../domain/errors';
import type { Transaction } from '../../domain/transaction.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type ListTransactionsInput = { walletId: string };

export class ListTransactions {
  constructor(private readonly wallets: WalletRepository) {}

  async execute({ walletId }: ListTransactionsInput): Promise<Transaction[]> {
    if (!(await this.wallets.findById(walletId))) throw new NotFoundError(`Wallet ${walletId} not found`);
    return this.wallets.findTransactions(walletId);
  }
}
