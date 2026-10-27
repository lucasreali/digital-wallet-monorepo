import { IsOptional, IsString } from 'class-validator';

export class ListWalletsQuery {
  /** Only return the wallets of this user (id from svc-identidade) */
  @IsOptional()
  @IsString()
  ownerId?: string;
}
