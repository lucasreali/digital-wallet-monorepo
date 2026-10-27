import { Module } from '@nestjs/common';
import { IdentityService } from './domain/identity.service';
import { NotificationsService } from './domain/notifications.service';
import { WalletService } from './domain/wallet.service';
import { AggregatedDataController } from './features/aggregated-data/aggregated-data.controller';
import { CloseWalletController } from './features/close-wallet/close-wallet.controller';
import { CloseWallet } from './features/close-wallet/close-wallet.use-case';
import { CreateUserController } from './features/create-user/create-user.controller';
import { CreateUser } from './features/create-user/create-user.use-case';
import { DeleteUserController } from './features/delete-user/delete-user.controller';
import { DeleteUser } from './features/delete-user/delete-user.use-case';
import { DepositController } from './features/deposit/deposit.controller';
import { Deposit } from './features/deposit/deposit.use-case';
import { GetUserController } from './features/get-user/get-user.controller';
import { GetUser } from './features/get-user/get-user.use-case';
import { GetWalletController } from './features/get-wallet/get-wallet.controller';
import { GetWallet } from './features/get-wallet/get-wallet.use-case';
import { ListTransactionsController } from './features/list-transactions/list-transactions.controller';
import { ListTransactions } from './features/list-transactions/list-transactions.use-case';
import { ListUsersController } from './features/list-users/list-users.controller';
import { ListUsers } from './features/list-users/list-users.use-case';
import { ListWalletsController } from './features/list-wallets/list-wallets.controller';
import { ListWallets } from './features/list-wallets/list-wallets.use-case';
import { OpenWalletController } from './features/open-wallet/open-wallet.controller';
import { OpenWallet } from './features/open-wallet/open-wallet.use-case';
import { UpdateUserController } from './features/update-user/update-user.controller';
import { UpdateUser } from './features/update-user/update-user.use-case';
import { WithdrawController } from './features/withdraw/withdraw.controller';
import { Withdraw } from './features/withdraw/withdraw.use-case';
import { HttpIdentityService } from './infrastructure/http-identity.service';
import { HttpNotificationsService } from './infrastructure/http-notifications.service';
import { HttpWalletService } from './infrastructure/http-wallet.service';

// Use cases stay framework-free, so Nest builds them through factories that receive their ports
// biome-ignore lint/suspicious/noExplicitAny: each use case has its own constructor signature
const useCase = <T>(UseCase: new (...ports: any[]) => T, ...inject: unknown[]) => ({
  provide: UseCase,
  useFactory: (...ports: unknown[]) => new UseCase(...ports),
  inject: inject as (abstract new () => unknown)[],
});

@Module({
  controllers: [
    ListUsersController,
    GetUserController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    ListWalletsController,
    GetWalletController,
    OpenWalletController,
    DepositController,
    WithdrawController,
    CloseWalletController,
    ListTransactionsController,
    AggregatedDataController,
  ],
  providers: [
    { provide: IdentityService, useClass: HttpIdentityService },
    { provide: WalletService, useClass: HttpWalletService },
    { provide: NotificationsService, useClass: HttpNotificationsService },
    useCase(ListUsers, IdentityService),
    useCase(GetUser, IdentityService),
    useCase(CreateUser, IdentityService),
    useCase(UpdateUser, IdentityService),
    useCase(DeleteUser, IdentityService),
    useCase(ListWallets, WalletService),
    useCase(GetWallet, WalletService),
    useCase(OpenWallet, WalletService),
    useCase(Deposit, WalletService),
    useCase(Withdraw, WalletService),
    useCase(CloseWallet, WalletService),
    useCase(ListTransactions, WalletService),
  ],
})
export class AppModule {}
