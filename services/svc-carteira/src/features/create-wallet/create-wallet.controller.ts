import { Body, Controller, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import type { CreateWalletDto } from './create-wallet.dto';
import type { CreateWallet } from './create-wallet.use-case';

@Controller('wallets')
export class CreateWalletController {
  constructor(private readonly createWallet: CreateWallet) {}

  /** Opens a user's wallet; 409 if the user already has one */
  @Post()
  create(@Body() dto: CreateWalletDto): Promise<Wallet> {
    return this.createWallet.execute(dto);
  }
}
