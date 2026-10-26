import { User } from './user.entity';

// Porta do domínio: as fatias dependem dela, a infraestrutura implementa
export abstract class UserRepository {
  abstract create(data: Omit<User, 'id'>): Promise<User>;
  abstract findAll(): Promise<User[]>;
}
