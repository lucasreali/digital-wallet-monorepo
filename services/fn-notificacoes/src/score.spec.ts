import { describe, expect, it } from 'vitest';
import type { WalletEvent } from './events';
import { computeScore } from './score';

const event = (type: WalletEvent['type'], data: Record<string, unknown>): WalletEvent => ({
  id: crypto.randomUUID(),
  type,
  occurredAt: '2026-01-01T00:00:00.000Z',
  data,
});

describe('computeScore', () => {
  it('is neutral (500) without money movements', () => {
    expect(computeScore([])).toBe(500);
    expect(computeScore([event('WalletOpened', { walletId: 'w1', ownerId: 'u1' })])).toBe(500);
  });

  it('is 1000 when there are only deposits and 0 when there are only withdrawals', () => {
    expect(computeScore([event('Deposit', { ownerId: 'u1', amount: 100 })])).toBe(1000);
    expect(computeScore([event('Withdrawal', { ownerId: 'u1', amount: 100 })])).toBe(0);
  });

  it('scales with the share of money kept', () => {
    const events = [
      event('Deposit', { ownerId: 'u1', amount: 300 }),
      event('Withdrawal', { ownerId: 'u1', amount: 100 }),
    ];
    expect(computeScore(events)).toBe(750);
  });

  it('only counts the given owner when ownerId is set', () => {
    const events = [
      event('Deposit', { ownerId: 'u1', amount: 100 }),
      event('Withdrawal', { ownerId: 'u2', amount: 100 }),
    ];
    expect(computeScore(events, 'u1')).toBe(1000);
    expect(computeScore(events, 'u2')).toBe(0);
    expect(computeScore(events)).toBe(500);
  });
});
