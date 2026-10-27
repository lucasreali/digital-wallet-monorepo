import type { IdentityService } from '../../domain/identity.service';
import type { User } from '../../domain/user.entity';

export class ListUsers {
  constructor(private readonly identity: IdentityService) {}

  execute(): Promise<User[]> {
    return this.identity.listUsers();
  }
}
