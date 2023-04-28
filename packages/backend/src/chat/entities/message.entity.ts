// Third-party imports
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.sendMessages, {
    onDelete: 'CASCADE',
  })
  sender: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.messages, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;
}
