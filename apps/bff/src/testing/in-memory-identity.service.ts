import { randomUUID } from 'node:crypto';
import { ConflictError, NotFoundError } from '../domain/errors';
import { IdentityService, type UserInput } from '../domain/identity.service';
import type { User } from '../domain/user.entity';

// Test double for use-case specs; mimics svc-identidade without HTTP
export class InMemoryIdentityService extends IdentityService {
  users: User[] = [];

  async listUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return user;
  }

  async createUser(input: UserInput): Promise<User> {
    this.assertEmailFree(input.email);
    const user = { id: randomUUID(), ...input };
    this.users.push(user);
    return user;
  }

  async updateUser(id: string, input: Partial<UserInput>): Promise<User> {
    const user = await this.getUser(id);
    if (input.email && input.email !== user.email) this.assertEmailFree(input.email);
    return Object.assign(user, input);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUser(id);
    this.users = this.users.filter((u) => u.id !== id);
  }

  private assertEmailFree(email: string) {
    if (this.users.some((u) => u.email === email)) throw new ConflictError(`Email ${email} already in use`);
  }
}
