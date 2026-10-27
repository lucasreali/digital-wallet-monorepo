import { describe, expect, it } from 'vitest';
import { DomainError, NotFoundError } from '../../domain/errors';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { Withdraw } from './withdraw.use-case';

describe('Withdraw', () => {
  it('takes the amount from the balance', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');
    await wallets.deposit(id, 50);

    expect(await new Withdraw(wallets).execute({ id, amount: 20 })).toMatchObject({ balance: 30 });
  });

  it('forwards insufficient funds', async () => {
    const wallets = new InMemoryWalletService();
    const { id } = await wallets.openWallet('ana');

    await expect(new Withdraw(wallets).execute({ id, amount: 1 })).rejects.toThrow(DomainError);
  });

  it('rejects an unknown wallet', async () => {
    await expect(new Withdraw(new InMemoryWalletService()).execute({ id: 'nope', amount: 1 })).rejects.toThrow(
      NotFoundError,
    );
  });
});
