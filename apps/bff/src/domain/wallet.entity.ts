export class Wallet {
  /** Wallet id in svc-carteira (Azure SQL) */
  id: string;
  /** Id of the owning user in svc-identidade */
  ownerId: string;
  balance: number;
}

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
