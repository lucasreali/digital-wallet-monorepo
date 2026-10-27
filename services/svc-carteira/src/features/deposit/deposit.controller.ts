// biome-ignore-all lint/style/useImportType: Nest needs the runtime classes for DI and validation metadata
import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
import { DepositDto } from './deposit.dto';
import { Deposit } from './deposit.use-case';

@Controller('wallets')
export class DepositController {
  constructor(private readonly deposit: Deposit) {}

  /** Adds money to a wallet and records the transaction; 404 unknown wallet, 422 invalid amount */
  @Post(':id/deposit')
  @HttpCode(200)
  create(@Param('id', ParseUUIDPipe) id: string, @Body() dto: DepositDto): Promise<Wallet> {
    return this.deposit.execute({ walletId: id, amount: dto.amount });
  }
}
