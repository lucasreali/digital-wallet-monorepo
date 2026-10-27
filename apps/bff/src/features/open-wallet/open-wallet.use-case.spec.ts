import { describe, expect, it } from 'vitest';
import { ConflictError } from '../../domain/errors';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { OpenWallet } from './open-wallet.use-case';

describe('OpenWallet', () => {
  it('opens a wallet for the owner', async () => {
    const wallets = new InMemoryWalletService();

    expect(await new OpenWallet(wallets).execute({ ownerId: 'ana' })).toMatchObject({ ownerId: 'ana', balance: 0 });
  });

  it('forwards the conflict when the owner already has a wallet', async () => {
    const wallets = new InMemoryWalletService();
    await wallets.openWallet('ana');

    await expect(new OpenWallet(wallets).execute({ ownerId: 'ana' })).rejects.toThrow(ConflictError);
  });
});
