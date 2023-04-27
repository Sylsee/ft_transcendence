// Third-party imports
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('mute_users')
export class MuteUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp without time zone' })
  muteEndTime: Date;

  @ManyToOne(() => UserEntity, (user) => user.muteChannels, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.muteUsers, {
    onDelete: 'CASCADE',
  })
  channel: ChannelEntity;
}
