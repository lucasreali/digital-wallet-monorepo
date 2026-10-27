import { ConflictError, NotFoundError } from '../../domain/errors';
import type { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';

export type UpdateUserInput = Partial<Omit<User, 'id'>>;

export class UpdateUser {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<User> {
    if (input.email) {
      const owner = await this.users.findByEmail(input.email);
      if (owner && owner.id !== id) throw new ConflictError(`Email ${input.email} is already in use`);
    }
    const user = await this.users.update(id, input);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return user;
  }
}
