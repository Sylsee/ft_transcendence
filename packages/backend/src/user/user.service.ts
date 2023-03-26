// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { AuthProvider } from '../auth/dto/auth-provider.enum';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUserDto): Promise<User> {
    return this.userRepository.create(user);
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<User | undefined> {
    return this.userRepository.findUserByProviderIDAndProvider(
      providerId,
      provider,
    );
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }
}
