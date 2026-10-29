import { Controller, Get, Param } from '@nestjs/common';
import type { Transaction } from '../../domain/transaction.entity';
import { ListTransactions } from './list-transactions.use-case';

@Controller('wallets')
export class ListTransactionsController {
  constructor(private readonly listTransactions: ListTransactions) {}

  /** Lists a wallet's deposits and withdrawals, newest first; 404 unknown wallet */
  @Get(':id/transactions')
  list(@Param('id') id: string): Promise<Transaction[]> {
    return this.listTransactions.execute({ walletId: id });
  }
}
