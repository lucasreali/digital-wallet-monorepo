import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors';
import { InMemoryIdentityService } from '../../testing/in-memory-identity.service';
import { GetUser } from './get-user.use-case';

describe('GetUser', () => {
  it('returns the user', async () => {
    const identity = new InMemoryIdentityService();
    const { id } = await identity.createUser({ name: 'Ana', email: 'ana@x.com' });

    expect(await new GetUser(identity).execute(id)).toMatchObject({ id, name: 'Ana' });
  });

  it('rejects an unknown id', async () => {
    await expect(new GetUser(new InMemoryIdentityService()).execute('nope')).rejects.toThrow(NotFoundError);
  });
});
