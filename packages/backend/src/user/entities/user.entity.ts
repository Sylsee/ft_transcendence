// Third-party imports
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Local imports
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { MuteUserEntity } from 'src/chat/entities/mute-user.entity';
import { AuthProvider } from '../../auth/enum/auth-provider.enum';
import { UserStatus } from '../enum/user-status.enum';

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
  profilePictureUrl: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.inactive,
  })
  status: UserStatus;

  @Column({ nullable: true })
  twoFactorAuthSecret: string;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  // Relationships
  @OneToMany(() => UserEntity, (user) => user.friends)
  friends: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.friendRequests)
  friendRequests: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blockedBy)
  @JoinTable()
  blockedUsers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.blockedUsers)
  blockedBy: UserEntity[];

  // Chat
  @ManyToMany(() => ChannelEntity, (channel) => channel.users, {
    nullable: true,
  })
  channels: ChannelEntity[];

  @OneToMany(() => ChannelEntity, (channel) => channel.owner, {
    nullable: true,
  })
  ownedChannels: ChannelEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sender, {
    cascade: ['remove'],
    nullable: true,
  })
  sendMessages: MessageEntity[];

  @OneToMany(() => MuteUserEntity, (muteUser) => muteUser.user, {
    cascade: ['remove'],
    nullable: true,
  })
  muteChannels: MuteUserEntity[];
}
