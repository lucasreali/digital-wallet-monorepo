import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryIdentityService } from '../../testing/in-memory-identity.service';
import { DeleteUser } from './delete-user.use-case';

describe('DeleteUser', () => {
  it('deletes the user', async () => {
    const identity = new InMemoryIdentityService();
    const { id } = await identity.createUser({ name: 'Ana', email: 'ana@x.com' });

    await new DeleteUser(identity).execute(id);

    expect(identity.users).toEqual([]);
  });

  it('rejects an unknown id', async () => {
    await expect(new DeleteUser(new InMemoryIdentityService()).execute('nope')).rejects.toThrow(NotFoundError);
  });
});
