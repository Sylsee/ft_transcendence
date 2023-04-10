// NestJS imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local files
import { AuthProvider } from '../auth/dto/auth-provider.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { FriendRequest } from './entities/friend_request.entity';
import { FriendRequestStatus } from './enum/friend_request-status.enum';
import { UserRelationship } from './enum/user-relationship.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRelationshipDto } from './dto/user-relationship.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
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

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { providerId, provider },
    });
  }

  async findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async getFriendsById(userId: string): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friend')
      .where('user.id = :id', { id: userId })
      .getMany();

    const user = await queryBuilder;
    return user[0].friends;
  }

  async getUserWithRelation(userId: string, relation: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: [relation],
    });
  }
}
