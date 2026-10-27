import {
  ConflictError,
  DomainError,
  InvalidInputError,
  NotFoundError,
  ServiceUnavailableError,
} from '../domain/errors';

// Calls a downstream service and turns its HTTP errors back into domain errors (same status, same message)
export async function httpJson<T>(url: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(url, {
    method: init.method,
    headers: init.body === undefined ? undefined : { 'content-type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  }).catch((err: Error) => {
    throw new ServiceUnavailableError(`${url} is unreachable: ${err.message}`);
  });
  if (res.status === 204) return undefined as T;
  if (res.ok) return res.json() as Promise<T>;

  // Nest's default error body: { statusCode, message: string | string[], error }
  const body = (await res.json().catch(() => ({}))) as { message?: string | string[] };
  const message = [body.message ?? `${url} answered ${res.status}`].flat().join(', ');
  throw errorFor(res.status, message);
}

function errorFor(status: number, message: string): DomainError {
  if (status === 400) return new InvalidInputError(message);
  if (status === 404) return new NotFoundError(message);
  if (status === 409) return new ConflictError(message);
  if (status === 422) return new DomainError(message);
  return new ServiceUnavailableError(message);
}
