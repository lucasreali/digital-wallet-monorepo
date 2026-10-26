import { beforeEach, describe, expect, it } from 'vitest';
import { ConflictError } from '../../domain/errors';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { CreateUser } from './create-user.use-case';

describe('CreateUser', () => {
  let users: InMemoryUserRepository;
  let createUser: CreateUser;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    createUser = new CreateUser(users);
  });

  it('creates a user', async () => {
    const user = await createUser.execute({ name: 'Ana', email: 'ana@mail.com' });

    expect(user).toMatchObject({ name: 'Ana', email: 'ana@mail.com' });
    expect(user.id).toBeDefined();
    expect(users.users).toHaveLength(1);
  });

  it('rejects an email that is already in use', async () => {
    await createUser.execute({ name: 'Ana', email: 'ana@mail.com' });

    await expect(createUser.execute({ name: 'Outra', email: 'ana@mail.com' })).rejects.toThrow(ConflictError);
    expect(users.users).toHaveLength(1);
  });
});
