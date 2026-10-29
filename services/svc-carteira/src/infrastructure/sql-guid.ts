// Shape of a SQL Server uniqueidentifier. Ids from NEWSEQUENTIALID() carry no RFC 9562 version digit, so a strict
// UUID check (ParseUUIDPipe) rejects them; anything outside this shape would fail the conversion inside SQL Server
const GUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

export const isSqlGuid = (id: string): boolean => GUID.test(id);
