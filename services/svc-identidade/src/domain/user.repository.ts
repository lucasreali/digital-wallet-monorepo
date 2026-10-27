import type { User } from './user.entity';

// Domain port: use cases depend on it, infrastructure implements it
export abstract class UserRepository {
  abstract create(data: Omit<User, 'id'>): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
}
