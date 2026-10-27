import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventPublisher } from './domain/event-publisher';
import { UserRepository } from './domain/user.repository';
import { WalletDirectory } from './domain/wallet-directory';
import { CreateUserController } from './features/create-user/create-user.controller';
import { CreateUser } from './features/create-user/create-user.use-case';
import { DeleteUserController } from './features/delete-user/delete-user.controller';
import { DeleteUser } from './features/delete-user/delete-user.use-case';
import { GetUserController } from './features/get-user/get-user.controller';
import { GetUser } from './features/get-user/get-user.use-case';
import { ListUsersController } from './features/list-users/list-users.controller';
import { ListUsers } from './features/list-users/list-users.use-case';
import { UpdateUserController } from './features/update-user/update-user.controller';
import { UpdateUser } from './features/update-user/update-user.use-case';
import { HttpWalletDirectory } from './infrastructure/http-wallet-directory';
import { MongoUserRepository, UserDocument, UserSchema } from './infrastructure/mongo-user.repository';
import { QueueEventPublisher } from './infrastructure/queue-event-publisher';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost:27017/identidade'),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
  ],
  controllers: [
    CreateUserController,
    ListUsersController,
    GetUserController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    { provide: UserRepository, useClass: MongoUserRepository },
    { provide: WalletDirectory, useClass: HttpWalletDirectory },
    { provide: EventPublisher, useClass: QueueEventPublisher },
    // Use cases stay framework-free, so Nest builds them through factories
    {
      provide: CreateUser,
      useFactory: (users: UserRepository, events: EventPublisher) => new CreateUser(users, events),
      inject: [UserRepository, EventPublisher],
    },
    { provide: ListUsers, useFactory: (users: UserRepository) => new ListUsers(users), inject: [UserRepository] },
    { provide: GetUser, useFactory: (users: UserRepository) => new GetUser(users), inject: [UserRepository] },
    { provide: UpdateUser, useFactory: (users: UserRepository) => new UpdateUser(users), inject: [UserRepository] },
    {
      provide: DeleteUser,
      useFactory: (users: UserRepository, wallets: WalletDirectory) => new DeleteUser(users, wallets),
      inject: [UserRepository, WalletDirectory],
    },
  ],
})
export class AppModule {}
