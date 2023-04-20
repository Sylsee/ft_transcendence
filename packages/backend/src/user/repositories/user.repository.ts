// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local files
import { AuthProvider } from '../../auth/dto/auth-provider.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  saveArray(users: UserEntity[]): Promise<UserEntity[]> {
    return this.userRepository.save(users);
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  async find(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserEntity | void> {
    return this.userRepository
      .findOne({
        where: { providerId, provider },
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

  async findOneById(id: string): Promise<UserEntity | void> {
    return this.userRepository.findOneBy({ id: id }).catch((error) => {
      this.logger.error(error);
    });
  }

  async getFriendsById(userId: string): Promise<UserEntity[] | void> {
    const user = await this.findOneByIdWithRelations(userId, ['friends']);

    if (user) {
      return user?.friends;
    }
  }

  async findOneByIdWithRelations(
    id: string,
    relations: string[],
  ): Promise<UserEntity | void> {
    return this.userRepository
      .findOne({
        where: { id: id },
        relations: relations,
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
