import { beforeEach, describe, expect, it } from 'vitest';
import { InsufficientFundsError, InvalidAmountError, NotFoundError } from '../../domain/errors';
import type { Wallet } from '../../domain/wallet.entity';
import { InMemoryEventPublisher } from '../../testing/in-memory-event-publisher';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { Withdraw } from './withdraw.use-case';

describe('Withdraw', () => {
  let wallets: InMemoryWalletRepository;
  let events: InMemoryEventPublisher;
  let withdraw: Withdraw;
  let wallet: Wallet;

  beforeEach(async () => {
    wallets = new InMemoryWalletRepository();
    events = new InMemoryEventPublisher();
    withdraw = new Withdraw(wallets, events);
    wallet = await wallets.open('user-1');
    wallet.balance = 100;
  });

  it('subtracts the amount, records the transaction and publishes Withdrawal', async () => {
    const updated = await withdraw.execute({ walletId: wallet.id, amount: 30.25 });

    expect(updated).toEqual({ ...wallet, balance: 69.75 });
    expect(await wallets.findTransactions(wallet.id)).toMatchObject([
      { walletId: wallet.id, type: 'withdrawal', amount: 30.25, balanceAfter: 69.75 },
    ]);
    expect(events.published).toEqual([
      { type: 'Withdrawal', data: { walletId: wallet.id, ownerId: 'user-1', amount: 30.25, balance: 69.75 } },
    ]);
  });

  it('can empty the wallet', async () => {
    expect(await withdraw.execute({ walletId: wallet.id, amount: 100 })).toMatchObject({ balance: 0 });
  });

  it('never leaves a negative balance', async () => {
    await expect(withdraw.execute({ walletId: wallet.id, amount: 100.01 })).rejects.toThrow(InsufficientFundsError);
    expect(wallet.balance).toBe(100);
    expect(wallets.transactions).toEqual([]);
    expect(events.published).toEqual([]);
  });

  it.each([0, -1, 0.001])('rejects the invalid amount %s', async (amount) => {
    await expect(withdraw.execute({ walletId: wallet.id, amount })).rejects.toThrow(InvalidAmountError);
  });

  it('rejects an unknown wallet', async () => {
    await expect(withdraw.execute({ walletId: 'nope', amount: 10 })).rejects.toThrow(NotFoundError);
  });
});
