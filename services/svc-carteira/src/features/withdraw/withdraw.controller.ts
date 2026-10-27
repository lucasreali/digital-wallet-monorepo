import { Body, Controller, HttpCode, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
// biome-ignore lint/style/useImportType: ValidationPipe and Swagger read the DTO class at runtime
import { WithdrawDto } from './withdraw.dto';
import { Withdraw } from './withdraw.use-case';

@Controller('wallets')
export class WithdrawController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(Withdraw) private readonly withdraw: Withdraw) {}

  /** Takes money out of a wallet and records the transaction; 404 unknown wallet, 422 invalid amount or insufficient funds */
  @Post(':id/withdraw')
  @HttpCode(200)
  create(@Param('id', ParseUUIDPipe) id: string, @Body() dto: WithdrawDto): Promise<Wallet> {
    return this.withdraw.execute({ walletId: id, amount: dto.amount });
  }
}
