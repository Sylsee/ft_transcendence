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
import { LobbyMode } from '../enum/lobby-mode.enum';

@Entity('matches')
export class MatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: LobbyMode })
  mode: LobbyMode;

  @ManyToOne(() => UserEntity, (user) => user.matchesWon, {
    nullable: true,
  })
  winner: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.matchesLost, {
    nullable: false,
  })
  loser: UserEntity;

  @Column()
  winnerPoints: number;

  @Column()
  loserPoints: number;
}
