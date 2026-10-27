import { describe, expect, it } from 'vitest';
import type { ActivityEvent } from '../../domain/notifications.entity';
import { InMemoryNotificationsService } from '../../testing/in-memory-notifications.service';
import { ListActivity } from './list-activity.use-case';

const event = (id: string): ActivityEvent => ({
  id,
  type: 'WalletOpened',
  occurredAt: '2026-01-01T00:00:00.000Z',
  data: { walletId: 'w1', ownerId: 'u1' },
});

describe('ListActivity', () => {
  it('returns the latest events up to the limit', async () => {
    const notifications = new InMemoryNotificationsService();
    notifications.events = [event('2'), event('1')];
    const listActivity = new ListActivity(notifications);

    expect(await listActivity.execute({})).toHaveLength(2);
    expect(await listActivity.execute({ limit: 1 })).toEqual([event('2')]);
  });
});
