import { Controller, Get, Inject, Query } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
// biome-ignore lint/style/useImportType: ValidationPipe and Swagger read the DTO class at runtime
import { ListWalletsQuery } from './list-wallets.dto';
import { ListWallets } from './list-wallets.use-case';

@Controller('wallets')
export class ListWalletsController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(ListWallets) private readonly listWallets: ListWallets) {}

  /** Lists every wallet, optionally filtered by owner */
  @Get()
  list(@Query() query: ListWalletsQuery): Promise<Wallet[]> {
    return this.listWallets.execute(query);
  }
}
