import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { DepositDto } from './deposit.dto';
import { Deposit } from './deposit.use-case';

@Controller('wallets')
export class DepositController {
  constructor(private readonly deposit: Deposit) {}

  /** Adds money to a wallet and records the transaction; 404 unknown wallet, 422 invalid amount */
  @Post(':id/deposit')
  @HttpCode(200)
  create(@Param('id') id: string, @Body() dto: DepositDto): Promise<Wallet> {
    return this.deposit.execute({ walletId: id, amount: dto.amount });
  }
}
