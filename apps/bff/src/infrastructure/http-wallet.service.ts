import type { Transaction, Wallet } from '../domain/wallet.entity';
import { WalletService } from '../domain/wallet.service';
import { httpJson } from './http-json';

const URL = process.env.SVC_CARTEIRA_URL ?? 'http://localhost:3002';
const wallet = (id: string) => `${URL}/wallets/${encodeURIComponent(id)}`;

export class HttpWalletService extends WalletService {
  listWallets(ownerId?: string) {
    return httpJson<Wallet[]>(`${URL}/wallets${ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : ''}`);
  }

  getWallet(id: string) {
    return httpJson<Wallet>(wallet(id));
  }

  openWallet(ownerId: string) {
    return httpJson<Wallet>(`${URL}/wallets`, { method: 'POST', body: { ownerId } });
  }

  deposit(id: string, amount: number) {
    return httpJson<Wallet>(`${wallet(id)}/deposit`, { method: 'POST', body: { amount } });
  }

  withdraw(id: string, amount: number) {
    return httpJson<Wallet>(`${wallet(id)}/withdraw`, { method: 'POST', body: { amount } });
  }

  closeWallet(id: string) {
    return httpJson<void>(wallet(id), { method: 'DELETE' });
  }

  listTransactions(id: string) {
    return httpJson<Transaction[]>(`${wallet(id)}/transactions`);
  }
}
