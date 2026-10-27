import type { IdentityService } from '../../domain/identity.service';
import type { User } from '../../domain/user.entity';

export class GetUser {
  constructor(private readonly identity: IdentityService) {}

  execute(id: string): Promise<User> {
    return this.identity.getUser(id);
  }
}
