// Third-party imports
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Local imports
import { UserEntity } from './user.entity';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  accepted: boolean;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({
    name: `FromUser`,
    foreignKeyConstraintName: `FK_FromUser_UserEntity`,
  })
  fromUser: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({
    name: `ToUser`,
    foreignKeyConstraintName: `FK_ToUser_UserEntity`,
  })
  toUser: UserEntity;
}
