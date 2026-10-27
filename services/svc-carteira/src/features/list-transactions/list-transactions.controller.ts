import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import type { Transaction } from '../../domain/transaction.entity';
import { ListTransactions } from './list-transactions.use-case';

@Controller('wallets')
export class ListTransactionsController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(ListTransactions) private readonly listTransactions: ListTransactions) {}

  /** Lists a wallet's deposits and withdrawals, newest first; 404 unknown wallet */
  @Get(':id/transactions')
  list(@Param('id', ParseUUIDPipe) id: string): Promise<Transaction[]> {
    return this.listTransactions.execute({ walletId: id });
  }
}
