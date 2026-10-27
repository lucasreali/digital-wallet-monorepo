import { randomUUID } from 'node:crypto';
import { QueueClient } from '@azure/storage-queue';
import { Injectable, Logger } from '@nestjs/common';
import { type DomainEvent, EventPublisher } from '../domain/event-publisher';

const QUEUE_NAME = 'wallet-events';

// Sends events to the Azure Storage Queue the Function triggers on; without a connection string it only logs
@Injectable()
export class QueueEventPublisher extends EventPublisher {
  private readonly logger = new Logger(QueueEventPublisher.name);
  private readonly connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  private queue?: Promise<QueueClient>;

  async publish(event: DomainEvent): Promise<void> {
    if (!this.connectionString) {
      this.logger.warn(`AZURE_STORAGE_CONNECTION_STRING is not set; skipping ${event.type}`);
      return;
    }
    const envelope = { id: randomUUID(), type: event.type, occurredAt: new Date().toISOString(), data: event.data };
    // Base64 body: the default encoding the Functions queue trigger expects
    await (await this.client()).sendMessage(Buffer.from(JSON.stringify(envelope)).toString('base64'));
  }

  private client(): Promise<QueueClient> {
    this.queue ??= (async () => {
      const queue = new QueueClient(this.connectionString as string, QUEUE_NAME);
      await queue.createIfNotExists();
      return queue;
    })();
    return this.queue;
  }
}
