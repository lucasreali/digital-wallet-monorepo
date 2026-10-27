import { Controller, Get, Inject } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
import { ListUsers } from './list-users.use-case';

@Controller('users')
export class ListUsersController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(ListUsers) private readonly listUsers: ListUsers) {}

  /** Lists every user */
  @Get()
  list(): Promise<User[]> {
    return this.listUsers.execute();
  }
}
