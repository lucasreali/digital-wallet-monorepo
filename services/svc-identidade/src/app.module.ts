import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './domain/user.repository';
import { CreateUserController } from './features/create-user/create-user.controller';
import { ListUsersController } from './features/list-users/list-users.controller';
import { MongoUserRepository, UserDocument, UserSchema } from './infrastructure/mongo-user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost:27017/identidade'),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
  ],
  controllers: [CreateUserController, ListUsersController],
  providers: [{ provide: UserRepository, useClass: MongoUserRepository }],
})
export class AppModule {}
