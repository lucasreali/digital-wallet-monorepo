import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class CreateUserController {
  constructor(private readonly users: UserRepository) {}

  /** Cadastra um usuário */
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.users.create(dto);
  }
}
