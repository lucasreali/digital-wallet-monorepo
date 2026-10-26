import { describe, expect, it } from 'vitest';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { ListWallets } from './list-wallets.use-case';

describe('ListWallets', () => {
  it('returns every wallet', async () => {
    const wallets = new InMemoryWalletRepository();
    await wallets.open('user-1');

    expect(await new ListWallets(wallets).execute()).toEqual(wallets.wallets);
  });
});
