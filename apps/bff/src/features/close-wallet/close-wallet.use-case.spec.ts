import { describe, expect, it } from 'vitest';
import { ConflictError, NotFoundError } from '../../domain/errors';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { CloseWallet } from './close-wallet.use-case';

describe('CloseWallet', () => {
  it('closes an empty wallet', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');

    await new CloseWallet(wallets).execute(id);

    expect(wallets.wallets).toEqual([]);
  });

  it('forwards the conflict when the balance is not zero', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');
    await wallets.deposit(id, 10);

    await expect(new CloseWallet(wallets).execute(id)).rejects.toThrow(ConflictError);
  });

  it('rejects an unknown wallet', async () => {
    await expect(new CloseWallet(new InMemoryWalletService()).execute('nope')).rejects.toThrow(NotFoundError);
  });
});
