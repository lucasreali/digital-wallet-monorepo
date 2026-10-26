import { Controller, Get } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { ListUsers } from './list-users.use-case';

@Controller('users')
export class ListUsersController {
  constructor(private readonly listUsers: ListUsers) {}

  /** Lists every user */
  @Get()
  list(): Promise<User[]> {
    return this.listUsers.execute();
  }
}
