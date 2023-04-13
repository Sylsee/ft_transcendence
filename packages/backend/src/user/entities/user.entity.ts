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
    nullable: true
  })
  @JoinTable()
  friends: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blockedUsers, {
    nullable: true
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
    cascade: true
  })
  receivedFriendRequests: FriendRequest[];
}
