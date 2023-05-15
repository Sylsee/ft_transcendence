// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { MatchEntity } from '../entity/match.entity';
import { LobbyMode } from '../enum/lobby-mode.enum';

@Injectable()
export class MatchRepository {
  private readonly logger: Logger = new Logger(MatchRepository.name);

  constructor(
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
  ) {}

  async create(
    mode: LobbyMode,
    player1: UserEntity,
    player2: UserEntity,
    player1Score: number,
    player2Score: number,
    winner?: UserEntity,
  ): Promise<MatchEntity> {
    const newMatch = new MatchEntity();
    newMatch.mode = mode;
    newMatch.player1 = player1;
    newMatch.player2 = player2;
    newMatch.player1Score = player1Score;
    newMatch.player2Score = player2Score;
    if (winner) newMatch.winner = winner;

    return this.matchRepository.save(newMatch);
  }
}
