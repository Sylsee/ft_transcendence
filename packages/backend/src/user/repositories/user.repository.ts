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

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async saveArray(users: UserEntity[]): Promise<UserEntity[]> {
    return await this.userRepository.save(users);
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

  findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { providerId, provider },
    });
  }

  async findOneById(id: string): Promise<UserEntity | void> {
    try {
      return await this.userRepository.findOneBy({ id: id });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getFriendsById(userId: string): Promise<UserEntity[] | void> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.friends', 'friend')
        .where('user.id = :id', { id: userId })
        .getOne();
      return user?.friends;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOneByIdWithRelations(
    id: string,
    relations: string[],
  ): Promise<UserEntity | void> {
    try {
      return await this.userRepository.findOne({
        where: { id: id },
        relations: relations,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
