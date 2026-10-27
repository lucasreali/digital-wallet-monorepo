import { Controller, Delete, HttpCode, HttpStatus, Inject, Param } from '@nestjs/common';
import { DeleteUser } from './delete-user.use-case';

@Controller('users')
export class DeleteUserController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(DeleteUser) private readonly deleteUser: DeleteUser) {}

  /** Deletes a user; 404 if it does not exist, 409 while the user still owns a wallet */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteUser.execute(id);
  }
}
