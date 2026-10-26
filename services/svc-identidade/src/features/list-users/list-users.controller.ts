import { Controller, Get } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

@Controller('users')
export class ListUsersController {
  constructor(private readonly users: UserRepository) {}

  /** Lista os usuários */
  @Get()
  list(): Promise<User[]> {
    return this.users.findAll();
  }
}
