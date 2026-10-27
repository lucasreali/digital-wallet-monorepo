import { Controller, Get, Param } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { GetWallet } from './get-wallet.use-case';

@Controller('wallets')
export class GetWalletController {
  constructor(private readonly getWallet: GetWallet) {}

  /** Gets one wallet; 404 if it does not exist */
  @Get(':id')
  handle(@Param('id') id: string): Promise<Wallet> {
    return this.getWallet.execute(id);
  }
}
