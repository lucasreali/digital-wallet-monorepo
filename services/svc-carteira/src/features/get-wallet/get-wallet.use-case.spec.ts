import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { GetWallet } from './get-wallet.use-case';

describe('GetWallet', () => {
  it('returns the wallet', async () => {
    const wallets = new InMemoryWalletRepository();
    const wallet = await wallets.open('user-1');

    expect(await new GetWallet(wallets).execute({ id: wallet.id })).toEqual(wallet);
  });

  it('rejects an unknown wallet', async () => {
    await expect(new GetWallet(new InMemoryWalletRepository()).execute({ id: 'nope' })).rejects.toThrow(NotFoundError);
  });
});
