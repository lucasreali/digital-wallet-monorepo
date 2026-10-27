// Domain errors know nothing about HTTP; api/domain-error.filter.ts maps them to status codes
export class DomainError extends Error {}
export class NotFoundError extends DomainError {}
export class ConflictError extends DomainError {}

export class UserOwnsWalletError extends ConflictError {
  constructor(userId: string) {
    super(`User ${userId} still owns a wallet; close it before deleting the user`);
  }
}
