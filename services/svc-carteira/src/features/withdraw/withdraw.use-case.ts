import { NotFoundError } from '../../domain/errors';
import type { EventPublisher } from '../../domain/event-publisher';
import { debit, type Wallet } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type WithdrawInput = { walletId: string; amount: number };

export class Withdraw {
  constructor(
    private readonly wallets: WalletRepository,
    private readonly events: EventPublisher,
  ) {}

  async execute({ walletId, amount }: WithdrawInput): Promise<Wallet> {
    const wallet = await this.wallets.findById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);
    const updated = debit(wallet, amount);
    await this.wallets.record(wallet, { type: 'withdrawal', amount, balanceAfter: updated.balance });
    await this.events.publish({
      type: 'Withdrawal',
      data: { walletId, ownerId: wallet.ownerId, amount, balance: updated.balance },
    });
    return updated;
  }
}
