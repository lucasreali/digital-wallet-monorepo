import { describe, expect, it } from 'vitest';
import { parseEvent } from './events';

const valid = { id: 'e1', type: 'Deposit', occurredAt: '2026-01-01T00:00:00.000Z', data: { amount: 10 } };

describe('parseEvent', () => {
  it('accepts a valid envelope, as an object or a JSON string', () => {
    expect(parseEvent(valid)).toEqual(valid);
    expect(parseEvent(JSON.stringify(valid))).toEqual(valid);
  });

  it('rejects unknown types and malformed envelopes', () => {
    expect(() => parseEvent({ ...valid, type: 'Unknown' })).toThrow();
    expect(() => parseEvent({ ...valid, id: undefined })).toThrow();
    expect(() => parseEvent({ ...valid, data: null })).toThrow();
    expect(() => parseEvent('not json')).toThrow();
  });
});
