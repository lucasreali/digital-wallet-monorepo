import { Controller, Get, Param } from '@nestjs/common';
import type { Transaction } from '../../domain/wallet.entity';
import { ListTransactions } from './list-transactions.use-case';

@Controller('wallets')
export class ListTransactionsController {
  constructor(private readonly listTransactions: ListTransactions) {}

  /** Lists a wallet's transactions, newest first; 404 if the wallet does not exist */
  @Get(':id/transactions')
  handle(@Param('id') id: string): Promise<Transaction[]> {
    return this.listTransactions.execute(id);
  }
}
