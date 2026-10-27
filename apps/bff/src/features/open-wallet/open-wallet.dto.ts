import { IsNotEmpty } from 'class-validator';

export class OpenWalletDto {
  /** Id of the owning user in svc-identidade */
  @IsNotEmpty()
  ownerId: string;
}
