import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPublisher } from './domain/event-publisher';
import { WalletRepository } from './domain/wallet.repository';
import { CreateWalletController } from './features/create-wallet/create-wallet.controller';
import { CreateWallet } from './features/create-wallet/create-wallet.use-case';
import { DepositController } from './features/deposit/deposit.controller';
import { Deposit } from './features/deposit/deposit.use-case';
import { GetWalletController } from './features/get-wallet/get-wallet.controller';
import { GetWallet } from './features/get-wallet/get-wallet.use-case';
import { ListWalletsController } from './features/list-wallets/list-wallets.controller';
import { ListWallets } from './features/list-wallets/list-wallets.use-case';
import { WithdrawController } from './features/withdraw/withdraw.controller';
import { Withdraw } from './features/withdraw/withdraw.use-case';
import { QueueEventPublisher } from './infrastructure/queue-event-publisher';
import { SqlWalletRepository, TransactionRow, WalletRow } from './infrastructure/sql-wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 1433),
      username: process.env.DB_USER ?? 'sa',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'carteira',
      options: { encrypt: true, trustServerCertificate: process.env.DB_TRUST_CERT === 'true' },
      entities: [WalletRow, TransactionRow],
      // shortcut: creates the tables by itself; switch to migrations before real data
      synchronize: true,
    }),
    TypeOrmModule.forFeature([WalletRow, TransactionRow]),
  ],
  controllers: [
    CreateWalletController,
    ListWalletsController,
    GetWalletController,
    DepositController,
    WithdrawController,
  ],
  providers: [
    { provide: WalletRepository, useClass: SqlWalletRepository },
    { provide: EventPublisher, useClass: QueueEventPublisher },
    // Use cases stay framework-free, so Nest builds them through factories
    {
      provide: CreateWallet,
      useFactory: (wallets: WalletRepository, events: EventPublisher) => new CreateWallet(wallets, events),
      inject: [WalletRepository, EventPublisher],
    },
    {
      provide: ListWallets,
      useFactory: (wallets: WalletRepository) => new ListWallets(wallets),
      inject: [WalletRepository],
    },
    {
      provide: GetWallet,
      useFactory: (wallets: WalletRepository) => new GetWallet(wallets),
      inject: [WalletRepository],
    },
    {
      provide: Deposit,
      useFactory: (wallets: WalletRepository, events: EventPublisher) => new Deposit(wallets, events),
      inject: [WalletRepository, EventPublisher],
    },
    {
      provide: Withdraw,
      useFactory: (wallets: WalletRepository, events: EventPublisher) => new Withdraw(wallets, events),
      inject: [WalletRepository, EventPublisher],
    },
  ],
})
export class AppModule {}
