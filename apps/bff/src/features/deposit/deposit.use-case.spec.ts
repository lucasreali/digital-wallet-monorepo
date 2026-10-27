import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { Deposit } from './deposit.use-case';

describe('Deposit', () => {
  it('adds the amount to the balance', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');

    expect(await new Deposit(wallets).execute({ id, amount: 50 })).toMatchObject({ balance: 50 });
  });

  it('rejects an unknown wallet', async () => {
    await expect(new Deposit(new InMemoryWalletService()).execute({ id: 'nope', amount: 1 })).rejects.toThrow(
      NotFoundError,
    );
  });
});
