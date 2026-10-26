import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../domain/user.entity';
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
    const doc = await this.users.create(data);
    return { id: doc.id, name: doc.name, email: doc.email };
  }

  async findAll(): Promise<User[]> {
    const docs = await this.users.find();
    return docs.map((d) => ({ id: d.id, name: d.name, email: d.email }));
  }
}
