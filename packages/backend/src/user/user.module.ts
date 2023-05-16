// NestJS imports
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local imports
import { GameModule } from 'src/game/game.module';
import { FriendRequest } from './entities/friend_request.entity';
import { UserEntity } from './entities/user.entity';
import { FriendRequestRepository } from './repositories/friend_request.repository';
import { UserRepository } from './repositories/user.repository';
import { FriendRequestService } from './services/friend_request.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FriendRequest]),
    forwardRef(() => GameModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    FriendRequestService,
    FriendRequestRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
