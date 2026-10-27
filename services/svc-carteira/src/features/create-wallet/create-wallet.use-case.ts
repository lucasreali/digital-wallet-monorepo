import { ConflictError } from '../../domain/errors';
import type { EventPublisher } from '../../domain/event-publisher';
import type { Wallet } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type CreateWalletInput = { ownerId: string };

export class CreateWallet {
  constructor(
    private readonly wallets: WalletRepository,
    private readonly events: EventPublisher,
  ) {}

  async execute({ ownerId }: CreateWalletInput): Promise<Wallet> {
    if (await this.wallets.findByOwner(ownerId)) {
      throw new ConflictError(`User ${ownerId} already has a wallet`);
    }
    const wallet = await this.wallets.open(ownerId);
    await this.events.publish({ type: 'WalletOpened', data: { walletId: wallet.id, ownerId } });
    return wallet;
  }
}
