import type { IdentityService } from '../../domain/identity.service';
import type { Insights } from '../../domain/notifications.entity';
import type { NotificationsService } from '../../domain/notifications.service';
import type { User } from '../../domain/user.entity';
import type { Wallet } from '../../domain/wallet.entity';
import type { WalletService } from '../../domain/wallet.service';

export type AggregatedData = { users: User[]; wallets: Wallet[]; insights: Insights };

export class GetAggregatedData {
  constructor(
    private readonly identity: IdentityService,
    private readonly wallets: WalletService,
    private readonly notifications: NotificationsService,
  ) {}

  // Calls the three sources in parallel
  async execute(): Promise<AggregatedData> {
    const [users, wallets, insights] = await Promise.all([
      this.identity.listUsers(),
      this.wallets.listWallets(),
      this.notifications.getInsights(),
    ]);
    return { users, wallets, insights };
  }
}
