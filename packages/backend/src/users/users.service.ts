import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private users = [];

  async find(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async delete(username: string): Promise<void> {
    const index = this.users.findIndex((user) => user.username === username);
    this.users.splice(index, 1);
  }

  async log(): Promise<void> {
    console.log(this.users);
  }
}
