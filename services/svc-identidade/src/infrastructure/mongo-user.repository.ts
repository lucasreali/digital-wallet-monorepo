import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, isValidObjectId, type Model } from 'mongoose';
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

  async findById(id: string): Promise<User | null> {
    // A malformed id cannot match any user: report "not found" instead of a cast error (500)
    if (!isValidObjectId(id)) return null;
    const doc = await this.users.findById(id);
    return doc && toDomain(doc);
  }

  async update(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | null> {
    if (!isValidObjectId(id)) return null;
    const doc = await this.users.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    return doc && toDomain(doc);
  }

  async delete(id: string): Promise<void> {
    if (isValidObjectId(id)) await this.users.findByIdAndDelete(id);
  }
}

const toDomain = (doc: HydratedDocument<UserDocument>): User => ({ id: doc.id, name: doc.name, email: doc.email });
