import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { DepositDto } from './deposit.dto';
import { Deposit } from './deposit.use-case';

@Controller('wallets')
export class DepositController {
  constructor(private readonly deposit: Deposit) {}

  /** Adds money to a wallet; 404 if it does not exist, 422 for an invalid amount */
  @Post(':id/deposit')
  @HttpCode(200)
  handle(@Param('id') id: string, @Body() dto: DepositDto): Promise<Wallet> {
    return this.deposit.execute({ id, ...dto });
  }
}
