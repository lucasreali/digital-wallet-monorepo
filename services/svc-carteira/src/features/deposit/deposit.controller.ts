import { Body, Controller, HttpCode, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
// biome-ignore lint/style/useImportType: ValidationPipe and Swagger read the DTO class at runtime
import { DepositDto } from './deposit.dto';
import { Deposit } from './deposit.use-case';

@Controller('wallets')
export class DepositController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(Deposit) private readonly deposit: Deposit) {}

  /** Adds money to a wallet and records the transaction; 404 unknown wallet, 422 invalid amount */
  @Post(':id/deposit')
  @HttpCode(200)
  create(@Param('id', ParseUUIDPipe) id: string, @Body() dto: DepositDto): Promise<Wallet> {
    return this.deposit.execute({ walletId: id, amount: dto.amount });
  }
}
