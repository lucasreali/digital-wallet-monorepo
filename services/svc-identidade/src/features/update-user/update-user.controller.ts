import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import type { User } from '../../domain/user.entity';
// biome-ignore lint/style/useImportType: ValidationPipe and Swagger read the DTO class at runtime
import { UpdateUserDto } from './update-user.dto';
import { UpdateUser } from './update-user.use-case';

@Controller('users')
export class UpdateUserController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(UpdateUser) private readonly updateUser: UpdateUser) {}

  /** Updates a user's name and/or email; 404 if it does not exist, 409 if the email is already in use */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.updateUser.execute(id, dto);
  }
}
