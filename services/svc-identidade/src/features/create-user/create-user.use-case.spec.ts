import { beforeEach, describe, expect, it } from 'vitest';
import { ConflictError } from '../../domain/errors';
import { InMemoryEventPublisher } from '../../testing/in-memory-event-publisher';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { CreateUser } from './create-user.use-case';

describe('CreateUser', () => {
  let users: InMemoryUserRepository;
  let events: InMemoryEventPublisher;
  let createUser: CreateUser;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    events = new InMemoryEventPublisher();
    createUser = new CreateUser(users, events);
  });

  it('creates a user', async () => {
    const user = await createUser.execute({ name: 'Ana', email: 'ana@mail.com' });

    expect(user).toMatchObject({ name: 'Ana', email: 'ana@mail.com' });
    expect(user.id).toBeDefined();
    expect(users.users).toHaveLength(1);
    expect(events.events).toEqual([
      { type: 'UserCreated', data: { userId: user.id, name: 'Ana', email: 'ana@mail.com' } },
    ]);
  });

  it('rejects an email that is already in use', async () => {
    await createUser.execute({ name: 'Ana', email: 'ana@mail.com' });

    await expect(createUser.execute({ name: 'Other', email: 'ana@mail.com' })).rejects.toThrow(ConflictError);
    expect(users.users).toHaveLength(1);
    expect(events.events).toHaveLength(1);
  });
});
