import { randomUUID } from 'node:crypto';
import { ServiceBusClient, type ServiceBusSender } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';
import { type DomainEvent, EventPublisher } from '../domain/event-publisher';

const QUEUE_NAME = 'wallet-events';

// Sends events to the Azure Service Bus queue the Function triggers on; without a connection string it only logs
@Injectable()
export class QueueEventPublisher extends EventPublisher {
  private readonly logger = new Logger(QueueEventPublisher.name);
  private readonly connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
  private sender?: ServiceBusSender;

  async publish(event: DomainEvent): Promise<void> {
    if (!this.connectionString) {
      this.logger.warn(`SERVICEBUS_CONNECTION_STRING is not set; skipping ${event.type}`);
      return;
    }
    const envelope = { id: randomUUID(), type: event.type, occurredAt: new Date().toISOString(), data: event.data };
    // JSON body: the Functions Service Bus trigger hands it to parseEvent as an object
    this.sender ??= new ServiceBusClient(this.connectionString).createSender(QUEUE_NAME);
    await this.sender.sendMessages({ body: envelope, contentType: 'application/json', messageId: envelope.id });
  }
}
