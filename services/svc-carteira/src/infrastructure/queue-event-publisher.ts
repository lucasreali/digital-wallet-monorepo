import { randomUUID } from 'node:crypto';
import { QueueClient } from '@azure/storage-queue';
import { Logger } from '@nestjs/common';
import { EventPublisher, type WalletEvent } from '../domain/event-publisher';

// Publishes to the Azure Storage Queue `wallet-events`, base64 JSON (the Functions queue trigger default)
export class QueueEventPublisher extends EventPublisher {
  private readonly logger = new Logger(QueueEventPublisher.name);
  private readonly queue = process.env.AZURE_STORAGE_CONNECTION_STRING
    ? new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, 'wallet-events')
    : undefined;
  private ready?: Promise<unknown>;

  async publish(event: WalletEvent): Promise<void> {
    if (!this.queue) {
      this.logger.warn(`AZURE_STORAGE_CONNECTION_STRING not set, skipping ${event.type}`);
      return;
    }
    const envelope = { id: randomUUID(), occurredAt: new Date().toISOString(), ...event };
    // shortcut: no outbox; a broker failure is logged instead of failing a request whose state is already committed
    try {
      this.ready ??= this.queue.createIfNotExists();
      await this.ready;
      await this.queue.sendMessage(Buffer.from(JSON.stringify(envelope)).toString('base64'));
    } catch (err) {
      this.ready = undefined;
      this.logger.error(`Could not publish ${event.type} ${envelope.id}`, err);
    }
  }
}
