import { IsOptional, IsString } from 'class-validator';

export class ListWalletsQuery {
  /** Only the wallets of this user */
  @IsOptional()
  @IsString()
  ownerId?: string;
}
