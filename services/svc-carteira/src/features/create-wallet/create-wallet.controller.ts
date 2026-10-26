import { Body, Controller, Post } from '@nestjs/common';
import { Wallet } from '../../domain/wallet.entity';
import { WalletRepository } from '../../domain/wallet.repository';
import { CreateWalletDto } from './create-wallet.dto';

@Controller('wallets')
export class CreateWalletController {
  constructor(private readonly wallets: WalletRepository) {}

  /** Abre a carteira de um usuário */
  @Post()
  create(@Body() dto: CreateWalletDto): Promise<Wallet> {
    return this.wallets.open(dto.ownerId);
  }
}
