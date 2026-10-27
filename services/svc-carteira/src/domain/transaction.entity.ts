export class Transaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  /** Wallet balance right after this transaction */
  balanceAfter: number;
  /** ISO 8601 timestamp */
  createdAt: string;
}

export type NewTransaction = Pick<Transaction, 'type' | 'amount' | 'balanceAfter'>;
