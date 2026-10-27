import { InsufficientFundsError, InvalidAmountError, WalletNotEmptyError } from './errors';

export class Wallet {
  id: string;
  ownerId: string;
  balance: number;
}

// Money rules work in whole cents to avoid float drift (0.1 + 0.2); SQL keeps DECIMAL(19,2)
const toCents = (value: number) => Math.round(value * 100);

const amountInCents = (amount: number) => {
  const cents = toCents(amount);
  if (!Number.isFinite(amount) || cents <= 0 || Math.abs(amount * 100 - cents) > 1e-6) {
    throw new InvalidAmountError(amount);
  }
  return cents;
};

export const credit = (wallet: Wallet, amount: number): Wallet => ({
  ...wallet,
  balance: (toCents(wallet.balance) + amountInCents(amount)) / 100,
});

export const debit = (wallet: Wallet, amount: number): Wallet => {
  const cents = toCents(wallet.balance) - amountInCents(amount);
  if (cents < 0) throw new InsufficientFundsError(wallet.balance, amount);
  return { ...wallet, balance: cents / 100 };
};

export const assertCanClose = (wallet: Wallet): void => {
  if (toCents(wallet.balance) !== 0) throw new WalletNotEmptyError(wallet.balance);
};
