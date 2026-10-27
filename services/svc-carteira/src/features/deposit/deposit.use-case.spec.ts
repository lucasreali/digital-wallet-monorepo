import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidAmountError, NotFoundError } from '../../domain/errors';
import type { Wallet } from '../../domain/wallet.entity';
import { InMemoryEventPublisher } from '../../testing/in-memory-event-publisher';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { Deposit } from './deposit.use-case';

describe('Deposit', () => {
  let wallets: InMemoryWalletRepository;
  let events: InMemoryEventPublisher;
  let deposit: Deposit;
  let wallet: Wallet;

  beforeEach(async () => {
    wallets = new InMemoryWalletRepository();
    events = new InMemoryEventPublisher();
    deposit = new Deposit(wallets, events);
    wallet = await wallets.open('user-1');
  });

  it('adds the amount, records the transaction and publishes Deposit', async () => {
    const updated = await deposit.execute({ walletId: wallet.id, amount: 50.5 });

    expect(updated).toEqual({ ...wallet, balance: 50.5 });
    expect(await wallets.findById(wallet.id)).toMatchObject({ balance: 50.5 });
    expect(await wallets.findTransactions(wallet.id)).toMatchObject([
      { walletId: wallet.id, type: 'deposit', amount: 50.5, balanceAfter: 50.5 },
    ]);
    expect(events.published).toEqual([
      { type: 'Deposit', data: { walletId: wallet.id, ownerId: 'user-1', amount: 50.5, balance: 50.5 } },
    ]);
  });

  it('adds cents without floating point drift', async () => {
    await deposit.execute({ walletId: wallet.id, amount: 0.1 });

    expect(await deposit.execute({ walletId: wallet.id, amount: 0.2 })).toMatchObject({ balance: 0.3 });
  });

  it.each([0, -10, 1.234, Number.NaN])('rejects the invalid amount %s', async (amount) => {
    await expect(deposit.execute({ walletId: wallet.id, amount })).rejects.toThrow(InvalidAmountError);
    expect(events.published).toEqual([]);
  });

  it('rejects an unknown wallet', async () => {
    await expect(deposit.execute({ walletId: 'nope', amount: 10 })).rejects.toThrow(NotFoundError);
  });
});
