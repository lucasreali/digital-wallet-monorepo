import { TableClient } from '@azure/data-tables';
import type { WalletEvent } from './events';

const connection = process.env.AZURE_STORAGE_CONNECTION_STRING ?? 'UseDevelopmentStorage=true';
// Azurite speaks plain http; real Azure Storage stays on https
const table = TableClient.fromConnectionString(connection, 'events', {
  allowInsecureConnection: connection.includes('UseDevelopmentStorage') || connection.includes('http://'),
});
let ready: Promise<void> | undefined;
const ensureTable = () => {
  ready ??= table.createTable();
  return ready;
};

// Row keys sort ascending, so an inverted timestamp lists the newest events first
const rowKey = (event: WalletEvent) =>
  `${String(8_640_000_000_000_000 - Date.parse(event.occurredAt)).padStart(16, '0')}_${event.id}`;

/** Upsert keyed by event id, so a redelivered message is stored once. */
export async function saveEvent(event: WalletEvent): Promise<void> {
  await ensureTable();
  await table.upsertEntity({
    partitionKey: 'events',
    rowKey: rowKey(event),
    id: event.id,
    type: event.type,
    occurredAt: event.occurredAt,
    data: JSON.stringify(event.data),
  });
}

/** Newest first. Without a limit it reads the whole table. */
// shortcut: single partition and full scan for the score, fine for a demo; partition by owner if volume grows
export async function listEvents(limit?: number): Promise<WalletEvent[]> {
  await ensureTable();
  const events: WalletEvent[] = [];
  for await (const entity of table.listEntities<{
    id: string;
    type: WalletEvent['type'];
    occurredAt: string;
    data: string;
  }>()) {
    events.push({ id: entity.id, type: entity.type, occurredAt: entity.occurredAt, data: JSON.parse(entity.data) });
    if (events.length === limit) break;
  }
  return events;
}
