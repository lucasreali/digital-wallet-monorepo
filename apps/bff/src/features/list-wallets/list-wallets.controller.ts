import { Controller, Get, Query } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { ListWalletsQuery } from './list-wallets.dto';
import { ListWallets } from './list-wallets.use-case';

@Controller('wallets')
export class ListWalletsController {
  constructor(private readonly listWallets: ListWallets) {}

  /** Lists every wallet (svc-carteira), optionally filtered by owner */
  @Get()
  handle(@Query() query: ListWalletsQuery): Promise<Wallet[]> {
    return this.listWallets.execute(query);
  }
}
