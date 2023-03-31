// NestJS imports
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { FriendRequest } from './entities/friend_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequest])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
