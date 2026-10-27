import { beforeEach, describe, expect, it } from 'vitest';
import { NotFoundError, UserOwnsWalletError } from '../../domain/errors';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { InMemoryWalletDirectory } from '../../testing/in-memory-wallet-directory';
import { DeleteUser } from './delete-user.use-case';

describe('DeleteUser', () => {
  let users: InMemoryUserRepository;
  let wallets: InMemoryWalletDirectory;
  let deleteUser: DeleteUser;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    wallets = new InMemoryWalletDirectory();
    deleteUser = new DeleteUser(users, wallets);
  });

  it('deletes a user without a wallet', async () => {
    const ana = await users.create({ name: 'Ana', email: 'ana@mail.com' });

    await deleteUser.execute(ana.id);

    expect(users.users).toEqual([]);
  });

  it('rejects an unknown id', async () => {
    await expect(deleteUser.execute('missing')).rejects.toThrow(NotFoundError);
  });

  it('refuses while the user still owns a wallet', async () => {
    const ana = await users.create({ name: 'Ana', email: 'ana@mail.com' });
    wallets.owners.add(ana.id);

    await expect(deleteUser.execute(ana.id)).rejects.toThrow(UserOwnsWalletError);
    expect(users.users).toHaveLength(1);
  });
});
