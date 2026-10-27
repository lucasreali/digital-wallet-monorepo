import { Body, Controller, Inject, Post } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
// biome-ignore lint/style/useImportType: ValidationPipe and Swagger read the DTO class at runtime
import { CreateUserDto } from './create-user.dto';
import { CreateUser } from './create-user.use-case';

@Controller('users')
export class CreateUserController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(CreateUser) private readonly createUser: CreateUser) {}

  /** Registers a user; 409 if the email is already in use */
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.createUser.execute(dto);
  }
}
