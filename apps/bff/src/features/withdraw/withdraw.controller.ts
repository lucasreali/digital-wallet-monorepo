import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { WithdrawDto } from './withdraw.dto';
import { Withdraw } from './withdraw.use-case';

@Controller('wallets')
export class WithdrawController {
  constructor(private readonly withdraw: Withdraw) {}

  /** Takes money from a wallet; 404 if it does not exist, 422 for insufficient funds or an invalid amount */
  @Post(':id/withdraw')
  @HttpCode(200)
  handle(@Param('id') id: string, @Body() dto: WithdrawDto): Promise<Wallet> {
    return this.withdraw.execute({ id, ...dto });
  }
}
