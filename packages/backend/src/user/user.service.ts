// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { AuthProvider } from '../auth/dto/auth-provider.enum';
import { UserDto, UserRelationshipDto } from './dto/user.dto';
import { FriendRequestDto } from './dto/friend_request.dto';
import { FriendRequest } from './entities/friend_request.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUserDto): Promise<UserDto> {
    return this.userRepository.create(user);
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserDto | undefined> {
    return this.userRepository.findUserByProviderIDAndProvider(
      providerId,
      provider,
    );
  }

  findAll(): Promise<UserDto[]> {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  updateOne(userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    return this.userRepository.updateOne(userId, updateUserDto);
  }

  getFriendsById(id: string): Promise<UserDto[]> {
    return this.userRepository.getFriendsById(id);
  }

  getSentFriendRequests(id: string): Promise<FriendRequestDto[]> {
    return this.userRepository.getSentFriendRequests(id);
  }

  getReceivedFriendRequests(id: string): Promise<FriendRequestDto[]> {
    return this.userRepository.getReceivedFriendRequests(id);
  }

  sendFriendRequest(sender: UserEntity, futureFriendId: string): Promise<FriendRequest> {
    return this.userRepository.sendFriendRequest(sender, futureFriendId);
  }

  getUserFriendsStatus(currentUser: UserEntity, specifyUserId: string): Promise<UserRelationshipDto> { 
    return this.userRepository.getUserFriendsStatus(currentUser, specifyUserId);
  }

  deleteFriend(currentUser: UserEntity, friendToDeleteId: string): Promise<UserDto> {
    return this.userRepository.deleteFriendById(currentUser, friendToDeleteId);
  }

  blockUserById(currentUser: UserEntity, userToBlockId: string): Promise<void> {
    return this.userRepository.blockUserById(currentUser, userToBlockId);
  }

  getBlockedUsers(currentUser: UserEntity): Promise<UserDto[]> {
    return this.userRepository.getBlockedUsers(currentUser);
  }

  unblockUserById(currentUser: UserEntity, userToBlockId: string): Promise<void> {
    return this.userRepository.unblockUserById(currentUser, userToBlockId);
  }
}
