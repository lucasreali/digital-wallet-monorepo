import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /** Full name */
  @IsNotEmpty()
  name: string;

  /** Email address, unique across users */
  @IsEmail()
  email: string;
}
