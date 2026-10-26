import { Controller, Get } from '@nestjs/common';
import { Wallet } from '../../domain/wallet.entity';
import { WalletRepository } from '../../domain/wallet.repository';

@Controller('wallets')
export class ListWalletsController {
  constructor(private readonly wallets: WalletRepository) {}

  /** Lista as carteiras */
  @Get()
  list(): Promise<Wallet[]> {
    return this.wallets.findAll();
  }
}
