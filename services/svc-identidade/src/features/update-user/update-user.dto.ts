import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  /** New full name */
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  /** New email address, unique across users */
  @IsOptional()
  @IsEmail()
  email?: string;
}
