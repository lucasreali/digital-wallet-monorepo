import { Controller, Get } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import type { ListWallets } from './list-wallets.use-case';

@Controller('wallets')
export class ListWalletsController {
  constructor(private readonly listWallets: ListWallets) {}

  /** Lists every wallet */
  @Get()
  list(): Promise<Wallet[]> {
    return this.listWallets.execute();
  }
}
