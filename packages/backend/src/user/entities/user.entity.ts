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
  @ManyToMany(() => UserEntity, (user) => user.friends)
  @JoinTable()
  friends: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blockedUsers)
  @JoinTable()
  blockedUsers: UserEntity[];
  
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

  @AfterLoad()
  async nullChecks() {
    if (!this.friends) {
      this.friends = [];
    }
    if (!this.blockedUsers) {
      this.blockedUsers = [];
    }
  }
}
