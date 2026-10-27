import { describe, expect, it, vi } from 'vitest';
import { ServiceUnavailableError } from '../../domain/errors';
import { InMemoryIdentityService } from '../../testing/in-memory-identity.service';
import { InMemoryNotificationsService } from '../../testing/in-memory-notifications.service';
import { InMemoryWalletService } from '../../testing/in-memory-wallet.service';
import { GetAggregatedData } from './get-aggregated-data.use-case';

describe('GetAggregatedData', () => {
  it('joins users (Mongo), wallets (SQL) and insights (Function) in one response', async () => {
    const identity = new InMemoryIdentityService();
    const wallets = new InMemoryWalletService();
    const notifications = new InMemoryNotificationsService();
    const user = await identity.createUser({ name: 'Ana', email: 'ana@x.com' });
    const wallet = await wallets.openWallet(user.id);

    expect(await new GetAggregatedData(identity, wallets, notifications).execute()).toEqual({
      users: [user],
      wallets: [wallet],
      insights: notifications.insights,
    });
  });

  it('fails when one of the sources is unavailable', async () => {
    const notifications = new InMemoryNotificationsService();
    vi.spyOn(notifications, 'getInsights').mockRejectedValue(new ServiceUnavailableError('down'));
    const getAggregatedData = new GetAggregatedData(
      new InMemoryIdentityService(),
      new InMemoryWalletService(),
      notifications,
    );

    await expect(getAggregatedData.execute()).rejects.toThrow(ServiceUnavailableError);
  });
});
