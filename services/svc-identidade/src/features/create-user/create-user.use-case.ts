import { ConflictError } from '../../domain/errors';
import type { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';

export type CreateUserInput = Omit<User, 'id'>;

export class CreateUser {
  constructor(private readonly users: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    if (await this.users.findByEmail(input.email)) {
      throw new ConflictError(`Email ${input.email} is already in use`);
    }
    return this.users.create(input);
  }
}
