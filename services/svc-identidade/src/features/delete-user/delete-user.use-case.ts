import { NotFoundError, UserOwnsWalletError } from '../../domain/errors';
import type { UserRepository } from '../../domain/user.repository';
import type { WalletDirectory } from '../../domain/wallet-directory';

export class DeleteUser {
  constructor(
    private readonly users: UserRepository,
    private readonly wallets: WalletDirectory,
  ) {}

  async execute(id: string): Promise<void> {
    if (!(await this.users.findById(id))) throw new NotFoundError(`User ${id} not found`);
    if (await this.wallets.hasWallet(id)) throw new UserOwnsWalletError(id);
    await this.users.delete(id);
  }
}
