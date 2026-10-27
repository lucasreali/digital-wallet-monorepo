import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './domain/user.repository';
import { CreateUserController } from './features/create-user/create-user.controller';
import { CreateUser } from './features/create-user/create-user.use-case';
import { GetUserController } from './features/get-user/get-user.controller';
import { GetUser } from './features/get-user/get-user.use-case';
import { ListUsersController } from './features/list-users/list-users.controller';
import { ListUsers } from './features/list-users/list-users.use-case';
import { UpdateUserController } from './features/update-user/update-user.controller';
import { UpdateUser } from './features/update-user/update-user.use-case';
import { MongoUserRepository, UserDocument, UserSchema } from './infrastructure/mongo-user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost:27017/identidade'),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
  ],
  controllers: [CreateUserController, ListUsersController, GetUserController, UpdateUserController],
  providers: [
    { provide: UserRepository, useClass: MongoUserRepository },
    // Use cases stay framework-free, so Nest builds them through factories
    { provide: CreateUser, useFactory: (users: UserRepository) => new CreateUser(users), inject: [UserRepository] },
    { provide: ListUsers, useFactory: (users: UserRepository) => new ListUsers(users), inject: [UserRepository] },
    { provide: GetUser, useFactory: (users: UserRepository) => new GetUser(users), inject: [UserRepository] },
    { provide: UpdateUser, useFactory: (users: UserRepository) => new UpdateUser(users), inject: [UserRepository] },
  ],
})
export class AppModule {}
