import { type DomainEvent, EventPublisher } from '../domain/event-publisher';

// Test double for use-case specs; records published events instead of sending them to the queue
export class InMemoryEventPublisher extends EventPublisher {
  events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}
