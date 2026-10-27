import { describe, expect, it } from 'vitest';
import { InMemoryIdentityService } from '../../testing/in-memory-identity.service';
import { ListUsers } from './list-users.use-case';

describe('ListUsers', () => {
  it('returns every user from svc-identidade', async () => {
    const identity = new InMemoryIdentityService();
    await identity.createUser({ name: 'Ana', email: 'ana@x.com' });

    expect(await new ListUsers(identity).execute()).toMatchObject([{ name: 'Ana' }]);
  });
});
