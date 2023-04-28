// Third-party imports
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Local imports
import { FriendRequestStatus } from '../enum/friend_request-status.enum';
import { UserEntity } from './user.entity';

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
