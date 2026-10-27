// biome-ignore-all lint/style/useImportType: Nest needs the runtime classes for DI and validation metadata
import { Controller, Get, Query } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { ListWalletsQuery } from './list-wallets.dto';
import { ListWallets } from './list-wallets.use-case';

@Controller('wallets')
export class ListWalletsController {
  constructor(private readonly listWallets: ListWallets) {}

  /** Lists every wallet, optionally filtered by owner */
  @Get()
  list(@Query() query: ListWalletsQuery): Promise<Wallet[]> {
    return this.listWallets.execute(query);
  }
}
