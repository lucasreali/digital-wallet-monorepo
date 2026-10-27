import { Body, Controller, Post } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
import { CreateUserDto } from './create-user.dto';
import { CreateUser } from './create-user.use-case';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUser: CreateUser) {}

  /** Registers a user; 409 if the email is already in use */
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.createUser.execute(dto);
  }
}
