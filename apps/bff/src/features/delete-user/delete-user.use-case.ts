import type { IdentityService } from '../../domain/identity.service';

export class DeleteUser {
  constructor(private readonly identity: IdentityService) {}

  execute(id: string): Promise<void> {
    return this.identity.deleteUser(id);
  }
}
