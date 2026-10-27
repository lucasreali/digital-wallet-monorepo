import { describe, expect, it } from 'vitest';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { ListWallets } from './list-wallets.use-case';

describe('ListWallets', () => {
  it('lists every wallet, or only the owner ones', async () => {
    const wallets = new InMemoryWalletService();
    await wallets.openWallet('ana');
    await wallets.openWallet('bia');
    const listWallets = new ListWallets(wallets);

    expect(await listWallets.execute({})).toHaveLength(2);
    expect(await listWallets.execute({ ownerId: 'bia' })).toMatchObject([{ ownerId: 'bia' }]);
  });
});
