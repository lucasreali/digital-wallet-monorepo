// biome-ignore-all lint/style/useImportType: Nest needs the runtime classes for DI and validation metadata
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { GetWallet } from './get-wallet.use-case';

@Controller('wallets')
export class GetWalletController {
  constructor(private readonly getWallet: GetWallet) {}

  /** Returns one wallet; 404 if it does not exist */
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Wallet> {
    return this.getWallet.execute({ id });
  }
}
