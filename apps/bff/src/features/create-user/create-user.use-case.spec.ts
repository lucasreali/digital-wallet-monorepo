import { describe, expect, it } from 'vitest';
import { ConflictError } from '../../domain/errors';
import { InMemoryIdentityService } from '../../testing/in-memory-identity.service';
import { CreateUser } from './create-user.use-case';

describe('CreateUser', () => {
  it('creates the user in svc-identidade', async () => {
    const identity = new InMemoryIdentityService();

    const user = await new CreateUser(identity).execute({ name: 'Ana', email: 'ana@x.com' });

    expect(identity.users).toEqual([user]);
  });

  it('forwards a duplicate email conflict', async () => {
    const identity = new InMemoryIdentityService();
    await identity.createUser({ name: 'Ana', email: 'ana@x.com' });

    await expect(new CreateUser(identity).execute({ name: 'Bia', email: 'ana@x.com' })).rejects.toThrow(ConflictError);
  });
});
