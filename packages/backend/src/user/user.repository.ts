// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { AuthProvider } from '../auth/dto/auth-provider.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserStatus } from './enum/user-status.enum';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });

    return this.userRepository.save(newUser);
  }

  async find(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserEntity | void> {
    return this.userRepository
      .findOne({
        where: { providerId, provider },
      })
      .catch((err) => {
        this.logger.error(
          `Error when finding user with providerId: ${providerId} and provider: ${provider}`,
          err,
        );
      });
  }

  async findOneById(id: string): Promise<UserEntity | void> {
    return this.userRepository.findOneBy({ id: id }).catch((err) => {
      this.logger.error(`Error when finding user with id: ${id}`, err);
    });
  }

  async findOneByName(username: string): Promise<UserEntity | void> {
    return this.userRepository.findOneBy({ name: username }).catch((err) => {
      this.logger.error(`Error when finding user with name: ${username}`, err);
    });
  }

  async isBlockingUser(
    user: UserEntity,
    blockedUserId: string,
  ): Promise<boolean> {
    return user.blockedUsers.some((user) => user.id === blockedUserId);
  }

  async findBlockingBy(userId: string): Promise<UserEntity[] | void> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.blockedBy', 'blockingUser')
      .where('user.id = :userId', { userId })
      .getMany()
      .catch((err) => {
        this.logger.error(
          `Error when finding users blocking user with id: ${userId}`,
          err,
        );
      });
  }

  async setUserStatus(userId: string, status: UserStatus): Promise<void> {
    this.userRepository.update({ id: userId }, { status: status });
  }
}
