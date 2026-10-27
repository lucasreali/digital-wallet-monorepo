import { EventPublisher, type WalletEvent } from '../domain/event-publisher';

// Test double that records what the use cases publish
export class InMemoryEventPublisher extends EventPublisher {
  published: WalletEvent[] = [];

  async publish(event: WalletEvent): Promise<void> {
    this.published.push(event);
  }
}
