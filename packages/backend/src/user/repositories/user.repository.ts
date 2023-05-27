// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// Local imports
import { AuthProvider } from 'src/auth/enum/auth-provider.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  private readonly logger: Logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async find(): Promise<UserEntity[]> {
    return this.userRepository.find({ relations: ['blockedUsers'] });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.provider = createUserDto.provider;
    newUser.providerId = createUserDto.providerId;
    newUser.email = createUserDto.email;
    newUser.name = createUserDto.name;
    newUser.profilePictureUrl = createUserDto.profilePictureUrl;

    return this.userRepository.save(newUser);
  }

  async update(
    userId: UserEntity['id'],
    content: QueryDeepPartialEntity<UserEntity>,
  ): Promise<void> {
    this.userRepository.update({ id: userId }, content);
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  saveArray(users: UserEntity[]): Promise<UserEntity[]> {
    return this.userRepository.save(users);
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

  async findOneByName(username: string): Promise<UserEntity | void> {
    return this.userRepository.findOneBy({ name: username }).catch((err) => {
      this.logger.error(`Error when finding user with name: ${username}`, err);
    });
  }

  async findOneByNameWithRelations(
    username: string,
    relations: Array<string>,
  ): Promise<UserEntity | void> {
    return this.userRepository
      .findOne({ where: { name: username }, relations: relations })
      .catch((err) => {
        this.logger.error(
          `Error when finding user with name: ${username}`,
          err,
        );
      });
  }

  async findUsersBlocking(
    userId: string,
    userIds: string[],
  ): Promise<UserEntity[] | void> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.blockedUsers', 'blockedUsers')
      .whereInIds(userIds)
      .andWhere('blockedUsers.id = :userId', { userId })
      .getMany()
      .catch((err) => {
        this.logger.error(
          `Error when finding users blocking user with id: ${userId}`,
          err,
        );
      });
  }

  async getFriendsById(userId: string): Promise<UserEntity[] | void> {
    const user = await this.findOneByIdWithRelations(userId, ['friends']);

    if (user) {
      return user?.friends;
    }
  }
}
