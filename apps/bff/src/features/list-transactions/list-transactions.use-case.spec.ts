import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { ListTransactions } from './list-transactions.use-case';

describe('ListTransactions', () => {
  it('lists the wallet transactions, newest first', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');
    await wallets.deposit(id, 50);
    await wallets.withdraw(id, 20);

    expect(await new ListTransactions(wallets).execute(id)).toMatchObject([
      { type: 'withdrawal', amount: 20, balanceAfter: 30 },
      { type: 'deposit', amount: 50, balanceAfter: 50 },
    ]);
  });

  it('rejects an unknown wallet', async () => {
    await expect(new ListTransactions(new InMemoryWalletService()).execute('nope')).rejects.toThrow(NotFoundError);
  });
});
