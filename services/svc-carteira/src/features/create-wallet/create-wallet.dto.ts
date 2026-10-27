import { IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  /** User id from svc-identidade */
  @IsNotEmpty()
  ownerId: string;
}
