// Third-party imports
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO
  @OneToMany(() => UserEntity, (user) => user.games)
  player1: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.games)
  player2: UserEntity;

  @Column()
  score: Record<string, number>;
}
