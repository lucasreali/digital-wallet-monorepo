import { Body, Controller, Param, Patch } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { UpdateUser } from './update-user.use-case';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUser: UpdateUser) {}

  /** Updates a user's name and/or email; 404 if it does not exist, 409 if the email is taken */
  @Patch(':id')
  handle(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.updateUser.execute({ id, ...dto });
  }
}
