import { NotFoundError } from '../../domain/errors';
import type { EventPublisher } from '../../domain/event-publisher';
import { credit, type Wallet } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type DepositInput = { walletId: string; amount: number };

export class Deposit {
  constructor(
    private readonly wallets: WalletRepository,
    private readonly events: EventPublisher,
  ) {}

  async execute({ walletId, amount }: DepositInput): Promise<Wallet> {
    const wallet = await this.wallets.findById(walletId);
    if (!wallet) throw new NotFoundError(`Wallet ${walletId} not found`);
    const updated = credit(wallet, amount);
    await this.wallets.record(wallet, { type: 'deposit', amount, balanceAfter: updated.balance });
    await this.events.publish({
      type: 'Deposit',
      data: { walletId, ownerId: wallet.ownerId, amount, balance: updated.balance },
    });
    return updated;
  }
}
