import type { ActivityEvent, Insights } from '../domain/notifications.entity';
import { NotificationsService } from '../domain/notifications.service';

// Test double for use-case specs; mimics fn-notificacoes without HTTP
export class InMemoryNotificationsService extends NotificationsService {
  insights: Insights = { score: 500, generatedAt: '2026-01-01T00:00:00.000Z' };
  events: ActivityEvent[] = [];

  async getInsights(): Promise<Insights> {
    return this.insights;
  }

  async listActivity(limit?: number): Promise<ActivityEvent[]> {
    return this.events.slice(0, limit);
  }
}
