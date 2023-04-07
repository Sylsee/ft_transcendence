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
}
