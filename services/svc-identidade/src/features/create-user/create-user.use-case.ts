import { ConflictError } from '../../domain/errors';
import type { EventPublisher } from '../../domain/event-publisher';
import type { User } from '../../domain/user.entity';
import type { UserRepository } from '../../domain/user.repository';

export type CreateUserInput = Omit<User, 'id'>;

export class CreateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly events: EventPublisher,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    if (await this.users.findByEmail(input.email)) {
      throw new ConflictError(`Email ${input.email} is already in use`);
    }
    const user = await this.users.create(input);
    await this.events.publish({ type: 'UserCreated', data: { userId: user.id, name: user.name, email: user.email } });
    return user;
  }
}
