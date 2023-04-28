// NestJS imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local imports
import { FriendRequest } from './entities/friend_request.entity';
import { UserEntity } from './entities/user.entity';
import { FriendRequestRepository } from './repositories/friend_request.repository';
import { UserRepository } from './repositories/user.repository';
import { FriendRequestService } from './services/friend_request.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequest])],
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
