// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { ftUserResponseDto } from 'src/auth/dto/ft-user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createOAuthUser(user: ftUserResponseDto): Promise<UserEntity> {
    const userExists = await this.userRepository.findOneBy42Id(user.id42);

    if (!userExists) {
      return this.create(user);
    }
    return userExists;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(createUserDto);
  }

  findAll(): Promise<UserEntity[]> {
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
