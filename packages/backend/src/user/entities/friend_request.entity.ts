// Third-party imports
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Local imports
import { UserEntity } from './user.entity';

@Entity('friend_requests')
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.sentFriendRequests)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests)
  receiver: UserEntity;
}
