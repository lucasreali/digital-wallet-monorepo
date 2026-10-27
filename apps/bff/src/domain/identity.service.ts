import type { User } from './user.entity';

export type UserInput = { name: string; email: string };

// Domain port for svc-identidade: use cases depend on it, infrastructure implements it
export abstract class IdentityService {
  abstract listUsers(): Promise<User[]>;
  abstract getUser(id: string): Promise<User>;
  abstract createUser(input: UserInput): Promise<User>;
  abstract updateUser(id: string, input: Partial<UserInput>): Promise<User>;
  abstract deleteUser(id: string): Promise<void>;
}
