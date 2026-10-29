import { randomUUID } from 'node:crypto';
import { ServiceBusClient } from '@azure/service-bus';
import { Logger } from '@nestjs/common';
import { EventPublisher, type WalletEvent } from '../domain/event-publisher';

// Publishes to the Azure Service Bus queue `wallet-events` as JSON (consumed by the fn-notificacoes Service Bus trigger)
export class QueueEventPublisher extends EventPublisher {
  private readonly logger = new Logger(QueueEventPublisher.name);
  private readonly sender = process.env.SERVICEBUS_CONNECTION_STRING
    ? new ServiceBusClient(process.env.SERVICEBUS_CONNECTION_STRING).createSender('wallet-events')
    : undefined;

  async publish(event: WalletEvent): Promise<void> {
    if (!this.sender) {
      this.logger.warn(`SERVICEBUS_CONNECTION_STRING not set, skipping ${event.type}`);
      return;
    }
    const envelope = { id: randomUUID(), occurredAt: new Date().toISOString(), ...event };
    // shortcut: no outbox; a broker failure is logged instead of failing a request whose state is already committed
    try {
      await this.sender.sendMessages({ body: envelope, contentType: 'application/json', messageId: envelope.id });
    } catch (err) {
      this.logger.error(`Could not publish ${event.type} ${envelope.id}`, err);
    }
  }
}
