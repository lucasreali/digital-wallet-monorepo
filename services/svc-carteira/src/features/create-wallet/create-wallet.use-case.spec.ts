import { beforeEach, describe, expect, it } from 'vitest';
import { ConflictError } from '../../domain/errors';
import { InMemoryWalletRepository } from '../../testing/in-memory-wallet.repository';
import { CreateWallet } from './create-wallet.use-case';

describe('CreateWallet', () => {
  let wallets: InMemoryWalletRepository;
  let createWallet: CreateWallet;

  beforeEach(() => {
    wallets = new InMemoryWalletRepository();
    createWallet = new CreateWallet(wallets);
  });

  it('opens a wallet with zero balance', async () => {
    const wallet = await createWallet.execute({ ownerId: 'user-1' });

    expect(wallet).toMatchObject({ ownerId: 'user-1', balance: 0 });
  });

  it('rejects a second wallet for the same owner', async () => {
    await createWallet.execute({ ownerId: 'user-1' });

    await expect(createWallet.execute({ ownerId: 'user-1' })).rejects.toThrow(ConflictError);
    expect(wallets.wallets).toHaveLength(1);
  });
});
