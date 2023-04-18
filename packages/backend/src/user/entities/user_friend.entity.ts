// Third-party imports
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Local imports
import { UserEntity } from './user.entity';

@Entity()
export class UserFriend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({
    name: `User`,
    foreignKeyConstraintName: `FK_UserFriends_UserEntity_User`,
  })
  user: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({
    name: `Friend`,
    foreignKeyConstraintName: `FK_UserFriends_UserEntity_Friend`,
  })
  friend: UserEntity;
}
