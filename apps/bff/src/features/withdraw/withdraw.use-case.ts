import type { Wallet } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export type WithdrawInput = { id: string; amount: number };

export class Withdraw {
  constructor(private readonly wallets: WalletService) {}

  execute({ id, amount }: WithdrawInput): Promise<Wallet> {
    return this.wallets.withdraw(id, amount);
  }
}
