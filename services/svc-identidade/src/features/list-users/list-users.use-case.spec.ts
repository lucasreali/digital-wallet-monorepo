import { describe, expect, it } from 'vitest';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { ListUsers } from './list-users.use-case';

describe('ListUsers', () => {
  it('returns every user', async () => {
    const users = new InMemoryUserRepository();
    await users.create({ name: 'Ana', email: 'ana@mail.com' });

    expect(await new ListUsers(users).execute()).toEqual(users.users);
  });
});
