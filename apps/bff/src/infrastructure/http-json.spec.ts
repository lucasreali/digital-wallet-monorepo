import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ConflictError,
  DomainError,
  InvalidInputError,
  NotFoundError,
  ServiceUnavailableError,
} from '../domain/errors';
import { httpJson } from './http-json';

const respond = (status: number, body?: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status })),
  );

describe('httpJson', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the JSON body', async () => {
    respond(200, { id: '1' });
    expect(await httpJson('http://svc/x')).toEqual({ id: '1' });
  });

  it('returns nothing on 204', async () => {
    respond(204);
    expect(await httpJson('http://svc/x', { method: 'DELETE' })).toBeUndefined();
  });

  it.each([
    [400, InvalidInputError],
    [404, NotFoundError],
    [409, ConflictError],
    [422, DomainError],
    [500, ServiceUnavailableError],
  ])('maps status %i to a domain error with the service message', async (status, ErrorClass) => {
    respond(status, { statusCode: status, message: 'boom', error: 'x' });
    const err: Error = await httpJson('http://svc/x').catch((e) => e);
    expect(err).toBeInstanceOf(ErrorClass);
    expect(err.message).toBe('boom');
  });

  it('joins validation messages', async () => {
    respond(400, { statusCode: 400, message: ['a', 'b'] });
    await expect(httpJson('http://svc/x')).rejects.toThrow('a, b');
  });

  it('maps an unreachable service to ServiceUnavailableError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
    await expect(httpJson('http://svc/x')).rejects.toThrow(ServiceUnavailableError);
  });
});
