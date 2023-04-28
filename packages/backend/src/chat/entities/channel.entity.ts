// Third-party imports
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelType } from '../enum/channel-type.enum';
import { MessageEntity } from './message.entity';
import { MuteUserEntity } from './mute-user.entity';

@Entity('channel')
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ChannelType, default: ChannelType.PRIVATE })
  type: ChannelType;

  @Column({ nullable: true, default: null })
  password?: string;

  @ManyToOne(() => UserEntity, (user) => user.ownedChannels, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  owner?: UserEntity;

  // Relationship with messages
  @OneToMany(() => MessageEntity, (message) => message.channel, {
    cascade: ['remove'],
    nullable: true,
  })
  messages: MessageEntity[];

  // Relationship with users
  @ManyToMany(() => UserEntity, (user) => user.channels, {
    nullable: true,
  })
  @JoinTable({
    name: 'channel_users',
    joinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  // Relationship with admins
  @ManyToMany(() => UserEntity, (user) => user.channels, {
    nullable: true,
  })
  @JoinTable({
    name: 'channel_admins',
    joinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  admins: UserEntity[];

  // Relationship with invited users
  @ManyToMany(() => UserEntity, (user) => user.channels, {
    nullable: true,
  })
  @JoinTable({
    name: 'channel_invited_users',
    joinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  invitedUsers: UserEntity[];

  // Relationship with banned users
  @ManyToMany(() => UserEntity, (user) => user.channels, {
    nullable: true,
  })
  @JoinTable({
    name: 'channel_ban_users',
    joinColumn: {
      name: 'channelId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  banUsers: UserEntity[];

  // Relationship with mute users
  @OneToMany(() => MuteUserEntity, (muteUser) => muteUser.channel, {
    cascade: ['remove'],
    nullable: true,
  })
  muteUsers: MuteUserEntity[];
}
