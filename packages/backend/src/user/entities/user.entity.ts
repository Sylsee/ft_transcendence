// Third-party imports
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  AfterLoad,
  JoinTable,
} from 'typeorm';

// Local files
import { AuthProvider } from '../../auth/dto/auth-provider.enum';
import { FriendRequest } from './friend_request.entity';
import { UserDto } from '../dto/user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
  })
  provider: AuthProvider;

  @Column()
  providerId: string;

  @Column()
  email: string;

  @Column({ unique: true })
  name: string;

  @Column()
  avatarUrl: string;

  // Relationships
  @ManyToMany(() => UserEntity, (user) => user.friends, {
    nullable: true,
  })
  @JoinTable()
  friends: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blockedUsers, {
    nullable: true,
  })
  @JoinTable()
  blockedUsers: UserEntity[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
    nullable: true,
    cascade: true,
  })
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
    nullable: true,
    cascade: true,
  })
  receivedFriendRequests: FriendRequest[];

  transformToDto(): UserDto {
    return {
      id: this.id,
      name: this.name,
      avatarUrl: this.avatarUrl,
    };
  }

  static async transformToDtoArray(users: UserEntity[]): Promise<UserDto[]> {
    const userDtos = users.map((user) =>
      plainToClass(UserDto, {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      }),
    );

    const errors = await validate(userDtos);

    if (errors.length > 0) {
      throw new InternalServerErrorException(`Error while transform to userDto array: ${errors}`);
    }

    return userDtos;
  }
}
