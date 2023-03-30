// Third-party imports
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

// Local files
import { AuthProvider } from '../../auth/dto/auth-provider.enum';

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
  @OneToMany(() => UserEntity, (user) => user.friends)
  friends: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.friendRequests)
  friendRequests: UserEntity[];

  @OneToMany(() => UserEntity, (user) => user.blockedUsers)
  blockedUsers: UserEntity[];
}
