import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { GetWallet } from './get-wallet.use-case';

describe('GetWallet', () => {
  it('returns the wallet', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');

    expect(await new GetWallet(wallets).execute(id)).toMatchObject({ id, ownerId: 'ana' });
  });

  it('rejects an unknown id', async () => {
    await expect(new GetWallet(new InMemoryWalletService()).execute('nope')).rejects.toThrow(NotFoundError);
  });
});
