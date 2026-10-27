import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { GetWallet } from './get-wallet.use-case';

@Controller('wallets')
export class GetWalletController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(GetWallet) private readonly getWallet: GetWallet) {}

  /** Returns one wallet; 404 if it does not exist */
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Wallet> {
    return this.getWallet.execute({ id });
  }
}
