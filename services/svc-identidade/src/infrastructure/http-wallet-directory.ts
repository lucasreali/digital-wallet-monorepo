import { Injectable } from '@nestjs/common';
import { WalletDirectory } from '../domain/wallet-directory';

// Asks svc-carteira over HTTP; any failure propagates (500) so a user is never deleted on an unknown answer
@Injectable()
export class HttpWalletDirectory extends WalletDirectory {
  private readonly baseUrl = process.env.SVC_CARTEIRA_URL ?? 'http://localhost:3002';

  async hasWallet(ownerId: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/wallets?ownerId=${encodeURIComponent(ownerId)}`);
    if (!res.ok) throw new Error(`svc-carteira answered ${res.status} when listing wallets of ${ownerId}`);
    const wallets: unknown[] = await res.json();
    return wallets.length > 0;
  }
}
