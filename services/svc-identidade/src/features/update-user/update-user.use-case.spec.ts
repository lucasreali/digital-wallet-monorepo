import { beforeEach, describe, expect, it } from 'vitest';
import { ConflictError, NotFoundError } from '../../domain/errors';
import type { User } from '../../domain/user.entity';
import { InMemoryUserRepository } from '../../testing/in-memory-user.repository';
import { UpdateUser } from './update-user.use-case';

describe('UpdateUser', () => {
  let users: InMemoryUserRepository;
  let updateUser: UpdateUser;
  let ana: User;

  beforeEach(async () => {
    users = new InMemoryUserRepository();
    updateUser = new UpdateUser(users);
    ana = await users.create({ name: 'Ana', email: 'ana@mail.com' });
  });

  it('updates the given fields only', async () => {
    const updated = await updateUser.execute(ana.id, { name: 'Ana Maria' });

    expect(updated).toEqual({ id: ana.id, name: 'Ana Maria', email: 'ana@mail.com' });
    expect(await users.findById(ana.id)).toEqual(updated);
  });

  it('keeps the same email without a conflict', async () => {
    await expect(updateUser.execute(ana.id, { email: 'ana@mail.com' })).resolves.toMatchObject({ id: ana.id });
  });

  it('rejects an unknown id', async () => {
    await expect(updateUser.execute('missing', { name: 'X' })).rejects.toThrow(NotFoundError);
  });

  it('rejects an email used by another user', async () => {
    await users.create({ name: 'Bia', email: 'bia@mail.com' });

    await expect(updateUser.execute(ana.id, { email: 'bia@mail.com' })).rejects.toThrow(ConflictError);
    expect((await users.findById(ana.id))?.email).toBe('ana@mail.com');
  });
});
