// NestJS imports
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local imports
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { GameEntity } from './entity/game.entity';
import { GameGateway } from './game.gateway';
import { LobbyManager } from './lobby/lobby.manager';

@Module({
  imports: [
    UserModule,
    AuthModule,
    forwardRef(() => ChatModule),
    TypeOrmModule.forFeature([GameEntity]),
  ],
  providers: [
    /* Gateway */
    GameGateway,
    /* Services */
    LobbyManager,
    /* Repositories */
  ],
  exports: [LobbyManager, GameGateway],
})
export class GameModule {}
