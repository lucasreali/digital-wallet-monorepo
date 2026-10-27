import { IdentityService, type UserInput } from '../domain/identity.service';
import type { User } from '../domain/user.entity';
import { httpJson } from './http-json';

const URL = process.env.SVC_IDENTIDADE_URL ?? 'http://localhost:3001';

export class HttpIdentityService extends IdentityService {
  listUsers() {
    return httpJson<User[]>(`${URL}/users`);
  }

  getUser(id: string) {
    return httpJson<User>(`${URL}/users/${encodeURIComponent(id)}`);
  }

  createUser(input: UserInput) {
    return httpJson<User>(`${URL}/users`, { method: 'POST', body: input });
  }

  updateUser(id: string, input: Partial<UserInput>) {
    return httpJson<User>(`${URL}/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: input });
  }

  deleteUser(id: string) {
    return httpJson<void>(`${URL}/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
}
