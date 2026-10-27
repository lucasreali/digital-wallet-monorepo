// Domain port for the wallet events; the adapter adds id and occurredAt
export type WalletEvent =
  | { type: 'WalletOpened'; data: { walletId: string; ownerId: string } }
  | { type: 'Deposit'; data: { walletId: string; ownerId: string; amount: number; balance: number } }
  | { type: 'Withdrawal'; data: { walletId: string; ownerId: string; amount: number; balance: number } }
  | { type: 'WalletClosed'; data: { walletId: string; ownerId: string } };

export abstract class EventPublisher {
  abstract publish(event: WalletEvent): Promise<void>;
}
