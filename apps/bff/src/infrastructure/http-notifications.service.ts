import type { ActivityEvent, Insights } from '../domain/notifications.entity';
import { NotificationsService } from '../domain/notifications.service';
import { httpJson } from './http-json';

const URL = process.env.FN_NOTIFICACOES_URL ?? 'http://localhost:7071';

export class HttpNotificationsService extends NotificationsService {
  getInsights() {
    return httpJson<Insights>(`${URL}/api/insights`);
  }

  listActivity(limit?: number) {
    return httpJson<ActivityEvent[]>(`${URL}/api/activity${limit ? `?limit=${limit}` : ''}`);
  }
}
