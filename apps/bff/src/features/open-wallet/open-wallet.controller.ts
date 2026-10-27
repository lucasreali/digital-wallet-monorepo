import { Body, Controller, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { OpenWalletDto } from './open-wallet.dto';
import { OpenWallet } from './open-wallet.use-case';

@Controller('wallets')
export class OpenWalletController {
  constructor(private readonly openWallet: OpenWallet) {}

  /** Opens a wallet for a user; 409 if the user already has one */
  @Post()
  handle(@Body() dto: OpenWalletDto): Promise<Wallet> {
    return this.openWallet.execute(dto);
  }
}
