import type { IdentityService } from '../../domain/identity.service';
import type { User } from '../../domain/user.entity';

export type UpdateUserInput = { id: string; name?: string; email?: string };

export class UpdateUser {
  constructor(private readonly identity: IdentityService) {}

  execute({ id, ...changes }: UpdateUserInput): Promise<User> {
    return this.identity.updateUser(id, changes);
  }
}
