import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createOAuthUser(user: any): Promise<User> {
    const userExists = await this.userRepository.findOneBy42Id(user.id42);

    if (!userExists) {
      return this.create(user);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneBy42Id(id42: number) {
    return this.userRepository.findOneBy42Id(id42);
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  remove(id: string) {
    this.userRepository.remove(id);
  }
}
