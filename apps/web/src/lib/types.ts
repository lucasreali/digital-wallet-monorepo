// Shapes the BFF returns (see the shared contracts). Structurally compatible with the Kubb types in #/gen.

export type User = { id: string; name: string; email: string }

export type Wallet = { id: string; ownerId: string; balance: number }

export type Transaction = {
  id: string
  walletId: string
  type: 'deposit' | 'withdrawal'
  amount: number
  balanceAfter: number
  createdAt: string
}

export type EventType = 'UserCreated' | 'WalletOpened' | 'Deposit' | 'Withdrawal' | 'WalletClosed'

export type ActivityEvent = {
  id: string
  type: EventType
  occurredAt: string
  data: {
    userId?: string
    name?: string
    email?: string
    walletId?: string
    ownerId?: string
    amount?: number
    balance?: number
  }
}

export type Insights = { score: number; generatedAt: string }
