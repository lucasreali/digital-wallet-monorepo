import { randomUUID } from 'node:crypto';
import type { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

// Test double for use-case specs; keeps unit tests free of MongoDB
export class InMemoryUserRepository extends UserRepository {
  users: User[] = [];

  async create(data: Omit<User, 'id'>): Promise<User> {
    const user = { id: randomUUID(), ...data };
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? Object.assign(user, data) : null;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
