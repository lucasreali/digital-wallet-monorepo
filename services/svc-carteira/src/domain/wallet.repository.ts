import { Wallet } from './wallet.entity';

// Porta do domínio: as fatias dependem dela, a infraestrutura implementa
export abstract class WalletRepository {
  abstract open(ownerId: string): Promise<Wallet>;
  abstract findAll(): Promise<Wallet[]>;
}
