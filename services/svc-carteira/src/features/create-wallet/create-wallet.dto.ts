import { IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  /** Id do usuário no svc-identidade */
  @IsNotEmpty()
  ownerId: string;
}
