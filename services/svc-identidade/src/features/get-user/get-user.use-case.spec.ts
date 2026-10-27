import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { GetUser } from './get-user.use-case';

describe('GetUser', () => {
  it('returns the user', async () => {
    const users = new InMemoryUserRepository();
    const ana = await users.create({ name: 'Ana', email: 'ana@mail.com' });

    expect(await new GetUser(users).execute(ana.id)).toEqual(ana);
  });

  it('rejects an unknown id', async () => {
    await expect(new GetUser(new InMemoryUserRepository()).execute('missing')).rejects.toThrow(NotFoundError);
  });
});
