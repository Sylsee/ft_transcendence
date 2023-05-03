// Third-party imports
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Local imports
import { UserEntity } from './user.entity';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
