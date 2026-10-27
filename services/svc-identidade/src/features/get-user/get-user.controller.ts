import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
import { GetUser } from './get-user.use-case';

@Controller('users')
export class GetUserController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(GetUser) private readonly getUser: GetUser) {}

  /** Returns one user; 404 if it does not exist */
  @Get(':id')
  get(@Param('id') id: string): Promise<User> {
    return this.getUser.execute(id);
  }
}
