import type { WalletEvent } from './events';

// Score = share of the money moved that was kept: 1000 * deposits / (deposits + withdrawals). No movements = neutral 500.
export function computeScore(events: WalletEvent[], ownerId?: string): number {
  let deposits = 0;
  let withdrawals = 0;
  for (const { type, data } of events) {
    if (ownerId && data.ownerId !== ownerId) continue;
    if (type === 'Deposit') deposits += Number(data.amount) || 0;
    if (type === 'Withdrawal') withdrawals += Number(data.amount) || 0;
  }
  const moved = deposits + withdrawals;
  return moved > 0 ? Math.round((1000 * deposits) / moved) : 500;
}
