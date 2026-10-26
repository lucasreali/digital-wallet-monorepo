import { Controller, Get } from '@nestjs/common';
import { Wallet } from '../../domain/wallet.entity';
import { ListWallets } from './list-wallets.use-case';

@Controller('wallets')
export class ListWalletsController {
  constructor(private readonly listWallets: ListWallets) {}

  /** Lists every wallet */
  @Get()
  list(): Promise<Wallet[]> {
    return this.listWallets.execute();
  }
}
