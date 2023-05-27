// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local imports
import { UserGameStatsDto } from 'src/user/dto/user-game-stats.dto';
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
    winner: UserEntity,
    loser: UserEntity,
    winnerPoints: number,
    loserPoints: number,
  ): Promise<MatchEntity> {
    const newMatch = new MatchEntity();
    newMatch.mode = mode;
    newMatch.winner = winner;
    newMatch.loser = loser;
    newMatch.winnerPoints = winnerPoints;
    newMatch.loserPoints = loserPoints;

    return this.matchRepository.save(newMatch);
  }

  async getUserMatches(
    userId: UserEntity['id'],
  ): Promise<MatchEntity[] | void> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.winner', 'winner')
      .leftJoinAndSelect('match.loser', 'loser')
      .where('match.winnerId = :id OR match.loserId = :id', { id: userId })
      .orderBy('match.createdAt', 'DESC')
      .getMany()
      .catch((error) => {
        this.logger.error(error);
      });
  }

  async getUserStats(
    userId: UserEntity['id'],
  ): Promise<UserGameStatsDto | void> {
    const result = await this.matchRepository
      .createQueryBuilder('match')
      .select([
        'SUM(CASE WHEN match.winnerId = :id THEN 1 ELSE 0 END) AS wins',
        'SUM(CASE WHEN match.loserId = :id THEN 1 ELSE 0 END) AS losses',
        'SUM(CASE WHEN match.winnerId = :id THEN match.winnerPoints WHEN match.loserId = :id THEN match.loserPoints END) AS "pointsScored"',
        'SUM(CASE WHEN match.winnerId = :id THEN match.loserPoints WHEN match.loserId = :id THEN match.winnerPoints END) AS "pointsAgainst"',
      ])
      .where('match.winnerId = :id OR match.loserId = :id', { id: userId })
      .getRawOne()
      .catch((error) => {
        this.logger.error(error);
      });

    const totalMatches = parseInt(result.wins) + parseInt(result.losses);
    const wins = parseInt(result.wins);
    const losses = parseInt(result.losses);
    const pointsScored = parseInt(result.pointsScored);
    const pointsAgainst = parseInt(result.pointsAgainst);

    return {
      totalMatches: totalMatches ?? 0,
      wins: wins ?? 0,
      losses: losses ?? 0,
      pointsScored: pointsScored ?? 0,
      pointsAgainst: pointsAgainst ?? 0,
    };
  }
}
