export class Insights {
  /** Score from 0 to 1000 computed by fn-notificacoes from the stored events */
  score: number;
  /** ISO 8601 timestamp */
  generatedAt: string;
}

export class ActivityEvent {
  /** Event id (uuid) */
  id: string;
  type: 'UserCreated' | 'WalletOpened' | 'Deposit' | 'Withdrawal' | 'WalletClosed';
  /** ISO 8601 timestamp */
  occurredAt: string;
  /** Event payload; its fields depend on the event type */
  data: Record<string, unknown>;
}
