import { NotFoundError } from '../../domain/errors';
import type { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';

export class GetUser {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return user;
  }
}
