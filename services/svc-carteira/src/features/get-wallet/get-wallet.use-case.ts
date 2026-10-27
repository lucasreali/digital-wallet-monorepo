import { NotFoundError } from '../../domain/errors';
import type { Wallet } from '../../domain/wallet.entity';
import type { WalletRepository } from '../../domain/wallet.repository';

export type GetWalletInput = { id: string };

export class GetWallet {
  constructor(private readonly wallets: WalletRepository) {}

  async execute({ id }: GetWalletInput): Promise<Wallet> {
    const wallet = await this.wallets.findById(id);
    if (!wallet) throw new NotFoundError(`Wallet ${id} not found`);
    return wallet;
  }
}
