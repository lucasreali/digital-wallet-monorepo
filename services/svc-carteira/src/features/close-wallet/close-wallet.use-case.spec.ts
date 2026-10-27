import { beforeEach, describe, expect, it } from 'vitest';
import { NotFoundError, WalletNotEmptyError } from '../../domain/errors';
import { InMemoryEventPublisher } from '../../testing/in-memory-event-publisher';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { CloseWallet } from './close-wallet.use-case';

describe('CloseWallet', () => {
  let wallets: InMemoryWalletRepository;
  let events: InMemoryEventPublisher;
  let closeWallet: CloseWallet;

  beforeEach(() => {
    wallets = new InMemoryWalletRepository();
    events = new InMemoryEventPublisher();
    closeWallet = new CloseWallet(wallets, events);
  });

  it('removes an empty wallet and publishes WalletClosed', async () => {
    const wallet = await wallets.open('user-1');

    await closeWallet.execute({ id: wallet.id });

    expect(wallets.wallets).toEqual([]);
    expect(events.published).toEqual([{ type: 'WalletClosed', data: { walletId: wallet.id, ownerId: 'user-1' } }]);
  });

  it('refuses to close a wallet that still holds money', async () => {
    const wallet = await wallets.open('user-1');
    wallet.balance = 0.01;

    await expect(closeWallet.execute({ id: wallet.id })).rejects.toThrow(WalletNotEmptyError);
    expect(wallets.wallets).toHaveLength(1);
    expect(events.published).toEqual([]);
  });

  it('rejects an unknown wallet', async () => {
    await expect(closeWallet.execute({ id: 'nope' })).rejects.toThrow(NotFoundError);
  });
});
