import { Controller, Get, Param } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
import { GetUser } from './get-user.use-case';

@Controller('users')
export class GetUserController {
  constructor(private readonly getUser: GetUser) {}

  /** Gets one user; 404 if it does not exist */
  @Get(':id')
  handle(@Param('id') id: string): Promise<User> {
    return this.getUser.execute(id);
  }
}
