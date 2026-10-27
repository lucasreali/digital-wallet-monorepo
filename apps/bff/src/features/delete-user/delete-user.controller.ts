import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { DeleteUser } from './delete-user.use-case';

@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUser: DeleteUser) {}

  /** Deletes a user; 404 if it does not exist, 409 while the user still owns a wallet */
  @Delete(':id')
  @HttpCode(204)
  handle(@Param('id') id: string): Promise<void> {
    return this.deleteUser.execute(id);
  }
}
