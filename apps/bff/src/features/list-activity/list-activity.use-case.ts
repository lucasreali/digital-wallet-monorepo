import type { ActivityEvent } from '../../domain/notifications.entity';
import type { NotificationsService } from '../../domain/notifications.service';

export type ListActivityInput = { limit?: number };

export class ListActivity {
  constructor(private readonly notifications: NotificationsService) {}

  execute({ limit }: ListActivityInput): Promise<ActivityEvent[]> {
    return this.notifications.listActivity(limit);
  }
}
