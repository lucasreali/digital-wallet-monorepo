import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument, Model } from 'mongoose';
import type { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Schema({ collection: 'users' })
export class UserDocument {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) email: string;
}
export const UserSchema = SchemaFactory.createForClass(UserDocument);

@Injectable()
export class MongoUserRepository extends UserRepository {
  constructor(@InjectModel(UserDocument.name) private readonly users: Model<UserDocument>) {
    super();
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    return toDomain(await this.users.create(data));
  }

  async findAll(): Promise<User[]> {
    return (await this.users.find()).map(toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.users.findOne({ email });
    return doc && toDomain(doc);
  }
}

const toDomain = (doc: HydratedDocument<UserDocument>): User => ({ id: doc.id, name: doc.name, email: doc.email });
