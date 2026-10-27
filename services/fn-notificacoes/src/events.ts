export const EVENT_TYPES = ['UserCreated', 'WalletOpened', 'Deposit', 'Withdrawal', 'WalletClosed'] as const;

/** Envelope published by svc-identidade and svc-carteira on the `wallet-events` queue (see docs/events/asyncapi.yaml). */
export interface WalletEvent {
  id: string;
  type: (typeof EVENT_TYPES)[number];
  occurredAt: string;
  data: Record<string, unknown>;
}

/** Validates a queue message; throws so a bad message ends up in the poison queue instead of the store. */
export function parseEvent(message: unknown): WalletEvent {
  const event = typeof message === 'string' ? JSON.parse(message) : message;
  const valid =
    typeof event?.id === 'string' &&
    EVENT_TYPES.includes(event.type) &&
    typeof event.occurredAt === 'string' &&
    typeof event.data === 'object' &&
    event.data !== null;
  if (!valid) throw new Error(`Invalid wallet event: ${JSON.stringify(message)}`);
  return { id: event.id, type: event.type, occurredAt: event.occurredAt, data: event.data };
}
