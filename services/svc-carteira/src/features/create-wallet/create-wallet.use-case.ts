import { ConflictError } from '../../domain/errors';
import { Wallet } from '../../domain/wallet.entity';
import { WalletRepository } from '../../domain/wallet.repository';

export type CreateWalletInput = { ownerId: string };

export class CreateWallet {
  constructor(private readonly wallets: WalletRepository) {}

  async execute({ ownerId }: CreateWalletInput): Promise<Wallet> {
    if (await this.wallets.findByOwner(ownerId)) {
      throw new ConflictError(`User ${ownerId} already has a wallet`);
    }
    return this.wallets.open(ownerId);
  }
}
