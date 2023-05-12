// NestJS imports
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local imports
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { MatchEntity } from './entity/match.entity';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';
import { MatchRepository } from './repository/match.repository';

@Module({
  imports: [
    UserModule,
    AuthModule,
    forwardRef(() => ChatModule),
    TypeOrmModule.forFeature([MatchEntity]),
  ],
  providers: [
    /* Gateway */
    GameGateway,
    /* Services */
    LobbyManager,
    /* Repositories */
    MatchRepository,
  ],
  exports: [LobbyManager, GameGateway],
})
export class GameModule {}
