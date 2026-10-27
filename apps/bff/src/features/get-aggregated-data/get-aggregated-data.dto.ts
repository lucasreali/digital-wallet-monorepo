import type { Insights } from '../../domain/notifications.entity';
import type { User } from '../../domain/user.entity';
import type { Wallet } from '../../domain/wallet.entity';

export class AggregatedDataDto {
  /** From svc-identidade (MongoDB) */
  users: User[];
  /** From svc-carteira (Azure SQL) */
  wallets: Wallet[];
  /** From fn-notificacoes (Azure Function) */
  insights: Insights;
}
