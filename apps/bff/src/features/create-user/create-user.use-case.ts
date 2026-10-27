import type { IdentityService } from '../../domain/identity.service';
import type { User } from '../../domain/user.entity';

export type CreateUserInput = { name: string; email: string };

export class CreateUser {
  constructor(private readonly identity: IdentityService) {}

  execute(input: CreateUserInput): Promise<User> {
    return this.identity.createUser(input);
  }
}
