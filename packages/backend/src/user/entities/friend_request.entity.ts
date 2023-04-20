// Third-party imports
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// Local files
import { UserEntity } from './user.entity';
import { FriendRequestStatus } from '../enum/friend_request-status.enum';
import { FriendRequestDto } from '../dto/friend_request.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    nullable: false,
    default: FriendRequestStatus.waitForApprove,
  })
  status: FriendRequestStatus;

  @ManyToOne(() => UserEntity, (user) => user.sentFriendRequests, {
    nullable: false,
  })
  @JoinColumn({
    foreignKeyConstraintName: `FK_Sender_UserEntity`,
  })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests, {
    nullable: false,
  })
  @JoinColumn({
    foreignKeyConstraintName: `FK_Receiver_UserEntity`,
  })
  receiver: UserEntity;

  static async transformToDtoArray(
    requests: FriendRequest[],
  ): Promise<FriendRequestDto[]> {
    const requestDtos = requests.map((request) =>
      plainToClass(FriendRequestDto, {
        id: request.id,
        status: request.status,
      }),
    );

    const errors = await validate(requestDtos);

    if (errors.length > 0) {
      throw new InternalServerErrorException(`Error while transform to friendRequestDto array: ${errors}`);
    }

    return requestDtos;
  }
}
