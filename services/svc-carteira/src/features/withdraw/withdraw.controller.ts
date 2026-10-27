// biome-ignore-all lint/style/useImportType: Nest needs the runtime classes for DI and validation metadata
import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { WithdrawDto } from './withdraw.dto';
import { Withdraw } from './withdraw.use-case';

@Controller('wallets')
export class WithdrawController {
  constructor(private readonly withdraw: Withdraw) {}

  /** Takes money out of a wallet and records the transaction; 404 unknown wallet, 422 invalid amount or insufficient funds */
  @Post(':id/withdraw')
  @HttpCode(200)
  create(@Param('id', ParseUUIDPipe) id: string, @Body() dto: WithdrawDto): Promise<Wallet> {
    return this.withdraw.execute({ walletId: id, amount: dto.amount });
  }
}
