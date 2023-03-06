import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private users = [];

  async find(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(user: User, accessToken: string): Promise<User> {
    this.users.push(user, accessToken);
    return user;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    this.users.splice(index, 1);
  }

  async log() {
    return this.users;
  }
}
