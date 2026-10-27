import { NotFoundError } from '../../domain/errors';
import type { EventPublisher } from '../../domain/event-publisher';
import { assertCanClose } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type CloseWalletInput = { id: string };

export class CloseWallet {
  constructor(
    private readonly wallets: WalletRepository,
    private readonly events: EventPublisher,
  ) {}

  async execute({ id }: CloseWalletInput): Promise<void> {
    const wallet = await this.wallets.findById(id);
    if (!wallet) throw new NotFoundError(`Wallet ${id} not found`);
    assertCanClose(wallet);
    await this.wallets.remove(wallet);
    await this.events.publish({ type: 'WalletClosed', data: { walletId: id, ownerId: wallet.ownerId } });
  }
}
