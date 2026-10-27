import { describe, expect, it } from 'vitest';
import { ConflictError, NotFoundError } from '../../domain/errors';
import { InMemoryIdentityService } from '../../testing/in-memory-identity.service';
import { UpdateUser } from './update-user.use-case';

describe('UpdateUser', () => {
  it('updates the given fields', async () => {
    const identity = new InMemoryIdentityService();
    const { id } = await identity.createUser({ name: 'Ana', email: 'ana@x.com' });

    expect(await new UpdateUser(identity).execute({ id, name: 'Ana Maria' })).toEqual({
      id,
      name: 'Ana Maria',
      email: 'ana@x.com',
    });
  });

  it('rejects an unknown id', async () => {
    await expect(new UpdateUser(new InMemoryIdentityService()).execute({ id: 'nope', name: 'X' })).rejects.toThrow(
      NotFoundError,
    );
  });

  it('forwards a duplicate email conflict', async () => {
    const identity = new InMemoryIdentityService();
    await identity.createUser({ name: 'Ana', email: 'ana@x.com' });
    const { id } = await identity.createUser({ name: 'Bia', email: 'bia@x.com' });

    await expect(new UpdateUser(identity).execute({ id, email: 'ana@x.com' })).rejects.toThrow(ConflictError);
  });
});
