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

@Entity('matches')
export class MatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.matches, {
    nullable: true,
  })
  winner?: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.matches, {
    nullable: false,
  })
  player1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.matches, {
    nullable: false,
  })
  player2: UserEntity;

  @Column({ default: 0 })
  player1Score: number;

  @Column({ default: 0 })
  player2Score: number;
}
