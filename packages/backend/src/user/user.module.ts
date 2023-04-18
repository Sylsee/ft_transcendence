// NestJS imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { FriendRequest } from './entities/friend_request.entity';
import { FriendRequestService } from './services/friend_request.service';
import { FriendRequestRepository } from './repositories/friend_request.repository';

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
