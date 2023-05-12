// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { MatchEntity } from '../entity/match.entity';

@Injectable()
export class MatchRepository {
  private readonly logger: Logger = new Logger(MatchRepository.name);

  constructor(
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
  ) {}

  async create(player1: UserEntity, player2: UserEntity): Promise<MatchEntity> {
    const newMatch = new MatchEntity();
    newMatch.player1 = player1;
    newMatch.player2 = player2;

    return this.matchRepository.save(newMatch);
  }

  async update(
    matchId: MatchEntity['id'],
    content: QueryDeepPartialEntity<MatchEntity>,
  ): Promise<void> {
    this.matchRepository.update({ id: matchId }, content);
  }
}
