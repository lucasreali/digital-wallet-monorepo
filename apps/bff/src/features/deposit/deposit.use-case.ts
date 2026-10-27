import type { Wallet } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export type DepositInput = { id: string; amount: number };

export class Deposit {
  constructor(private readonly wallets: WalletService) {}

  execute({ id, amount }: DepositInput): Promise<Wallet> {
    return this.wallets.deposit(id, amount);
  }
}
