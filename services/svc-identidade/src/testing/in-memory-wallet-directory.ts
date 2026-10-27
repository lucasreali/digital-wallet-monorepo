import { WalletDirectory } from '../domain/wallet-directory';

// Test double for use-case specs; keeps unit tests free of HTTP calls to svc-carteira
export class InMemoryWalletDirectory extends WalletDirectory {
  owners = new Set<string>();

  async hasWallet(ownerId: string): Promise<boolean> {
    return this.owners.has(ownerId);
  }
}
