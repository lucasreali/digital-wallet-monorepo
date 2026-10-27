import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { ListTransactions } from './list-transactions.use-case';

describe('ListTransactions', () => {
  it("returns the wallet's transactions, newest first", async () => {
    const wallets = new InMemoryWalletRepository();
    const wallet = await wallets.open('user-1');
    const other = await wallets.open('user-2');
    const first = await wallets.record(wallet, { type: 'deposit', amount: 10, balanceAfter: 10 });
    const second = await wallets.record({ ...wallet, balance: 10 }, { type: 'withdrawal', amount: 4, balanceAfter: 6 });
    await wallets.record(other, { type: 'deposit', amount: 1, balanceAfter: 1 });

    expect(await new ListTransactions(wallets).execute({ walletId: wallet.id })).toEqual([second, first]);
  });

  it('rejects an unknown wallet', async () => {
    await expect(new ListTransactions(new InMemoryWalletRepository()).execute({ walletId: 'nope' })).rejects.toThrow(
      NotFoundError,
    );
  });
});
