import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

export class ListUsers {
  constructor(private readonly users: UserRepository) {}

  execute(): Promise<User[]> {
    return this.users.findAll();
  }
}
