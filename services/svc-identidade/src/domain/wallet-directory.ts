// Domain port: tells whether a user still owns a wallet (wallets live in svc-carteira)
export abstract class WalletDirectory {
  abstract hasWallet(ownerId: string): Promise<boolean>;
}
