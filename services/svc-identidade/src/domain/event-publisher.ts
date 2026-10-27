// Integration events this service emits; the adapter wraps them in the { id, type, occurredAt, data } envelope
export type UserCreatedEvent = { type: 'UserCreated'; data: { userId: string; name: string; email: string } };
export type DomainEvent = UserCreatedEvent;

// Domain port: use cases publish after the state change succeeds
export abstract class EventPublisher {
  abstract publish(event: DomainEvent): Promise<void>;
}
