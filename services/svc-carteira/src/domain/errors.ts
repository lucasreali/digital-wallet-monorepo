// Domain errors know nothing about HTTP; api/domain-error.filter.ts maps them to status codes
export class DomainError extends Error {}
export class NotFoundError extends DomainError {}
export class ConflictError extends DomainError {}

export class InvalidAmountError extends DomainError {
  constructor(amount: number) {
    super(`Amount must be greater than zero with at most 2 decimal places, got ${amount}`);
  }
}

export class InsufficientFundsError extends DomainError {
  constructor(balance: number, amount: number) {
    super(`Insufficient funds: balance ${balance}, requested ${amount}`);
  }
}

export class WalletNotEmptyError extends ConflictError {
  constructor(balance: number) {
    super(`Wallet still holds ${balance}; withdraw everything before closing it`);
  }
}
