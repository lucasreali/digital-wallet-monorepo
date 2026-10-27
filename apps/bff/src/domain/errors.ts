// Domain errors know nothing about HTTP; api/domain-error.filter.ts maps them to status codes
export class DomainError extends Error {}
export class InvalidInputError extends DomainError {}
export class NotFoundError extends DomainError {}
export class ConflictError extends DomainError {}
/** A downstream service is unreachable or failed */
export class ServiceUnavailableError extends DomainError {}
