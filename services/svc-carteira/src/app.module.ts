import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from './domain/wallet.repository';
import { CreateWalletController } from './features/create-wallet/create-wallet.controller';
import { ListWalletsController } from './features/list-wallets/list-wallets.controller';
import { CreateWallet } from './features/create-wallet/create-wallet.use-case';
import { ListWallets } from './features/list-wallets/list-wallets.use-case';
import { SqlWalletRepository, WalletRow } from './infrastructure/sql-wallet.repository';

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
      entities: [WalletRow],
      // shortcut: cria as tabelas sozinho; trocar por migrations antes de dados reais
      synchronize: true,
    }),
    TypeOrmModule.forFeature([WalletRow]),
  ],
  controllers: [CreateWalletController, ListWalletsController],
  providers: [
    { provide: WalletRepository, useClass: SqlWalletRepository },
    // Use cases stay framework-free, so Nest builds them through factories
    { provide: CreateWallet, useFactory: (wallets: WalletRepository) => new CreateWallet(wallets), inject: [WalletRepository] },
    { provide: ListWallets, useFactory: (wallets: WalletRepository) => new ListWallets(wallets), inject: [WalletRepository] },
  ],
})
export class AppModule {}
