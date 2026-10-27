import { beforeEach, describe, expect, it } from 'vitest';
import { ConflictError } from '../../domain/errors';
import { InMemoryEventPublisher } from '../../testing/in-memory-event-publisher';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { CreateWallet } from './create-wallet.use-case';

describe('CreateWallet', () => {
  let wallets: InMemoryWalletRepository;
  let events: InMemoryEventPublisher;
  let createWallet: CreateWallet;

  beforeEach(() => {
    wallets = new InMemoryWalletRepository();
    events = new InMemoryEventPublisher();
    createWallet = new CreateWallet(wallets, events);
  });

  it('opens a wallet with zero balance and publishes WalletOpened', async () => {
    const wallet = await createWallet.execute({ ownerId: 'user-1' });

    expect(wallet).toMatchObject({ ownerId: 'user-1', balance: 0 });
    expect(events.published).toEqual([{ type: 'WalletOpened', data: { walletId: wallet.id, ownerId: 'user-1' } }]);
  });

  it('rejects a second wallet for the same owner', async () => {
    await createWallet.execute({ ownerId: 'user-1' });

    await expect(createWallet.execute({ ownerId: 'user-1' })).rejects.toThrow(ConflictError);
    expect(wallets.wallets).toHaveLength(1);
    expect(events.published).toHaveLength(1);
  });
});
