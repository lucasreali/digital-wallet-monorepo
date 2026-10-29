import { describe, expect, it } from 'vitest';
import { isSqlGuid } from './sql-guid';

describe('isSqlGuid', () => {
  it('accepts ids from SQL Server NEWSEQUENTIALID(), which carry no RFC 9562 version digit', () => {
    expect(isSqlGuid('72DD0B2F-9DD3-F111-BF59-002248E07D12')).toBe(true);
  });

  it('accepts random lowercase UUIDs', () => {
    expect(isSqlGuid('2c02a462-0d46-4437-905a-6556d897ab3f')).toBe(true);
  });

  it('rejects values SQL Server cannot convert to uniqueidentifier', () => {
    for (const id of ['6ae24b8af3aa68c5efad85a9', 'abc', '72DD0B2F-9DD3-F111-BF59-002248E07D1Z', '']) {
      expect(isSqlGuid(id)).toBe(false);
    }
  });
});
