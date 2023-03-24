// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { AuthProvider } from './dto/auth-provider.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(user);
  }

  async findUserByEmailAndProvider(
    email: string,
    provider: AuthProvider,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findUserByEmailAndProvider(email, provider);
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }
}
