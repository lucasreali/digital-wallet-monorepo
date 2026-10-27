import type { ActivityEvent, Insights } from './notifications.entity';

// Domain port for the fn-notificacoes Azure Function
export abstract class NotificationsService {
  abstract getInsights(): Promise<Insights>;
  abstract listActivity(limit?: number): Promise<ActivityEvent[]>;
}
