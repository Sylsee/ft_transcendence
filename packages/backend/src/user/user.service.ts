// Nest dependencies
import { Injectable } from '@nestjs/common';

// Local files
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { AuthProvider } from '../auth/dto/auth-provider.enum';
import { UserDto } from './dto/user.dto';
import { FriendRequestDto } from './dto/friend_request.dto';
import { FriendRequest } from './entities/friend_request.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRelationshipDto } from './dto/user-relationship.dto';
import { UserRelationship } from './enum/user-relationship.enum';

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

  async updateOne(userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    user.name = updateUserDto.name;
    
    return this.userRepository.save(user);
  }

  getFriendsById(id: string): Promise<UserDto[]> {
    return this.userRepository.getFriendsById(id);
  }

  async getSentFriendRequests(id: string): Promise<FriendRequestDto[]> {
    const user = await this.userRepository.getUserWithRelation(id, 'sentFriendRequests');
    return user.sentFriendRequests;
  }

  async getReceivedFriendRequests(id: string): Promise<FriendRequestDto[]> {
    const user = await this.userRepository.getUserWithRelation(id, 'receivedFriendRequests');
    return user.receivedFriendRequests;
  }

  async sendFriendRequest(sender: UserEntity, futureFriendId: string): Promise<FriendRequest> {
    const receiver = await this.userRepository.findOneById(futureFriendId);

    if (!receiver) {
      throw new Error(`User with ID ${futureFriendId} not found`);
    }

    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;

    sender.sentFriendRequests.push(friendRequest);
    receiver.receivedFriendRequests.push(friendRequest);

    await this.userRepository.saveArray([sender, receiver]);
    return friendRequest;

  }

  getUserFriendsStatus(currentUser: UserEntity, specifyUserId: string): UserRelationshipDto { 
    let relationship = new UserRelationshipDto();

    if (!currentUser) {
      throw new Error('In getUserFriendsStatus(): users not found');
    }

    if (currentUser.friends.some((friend) => friend.id === specifyUserId)) {
      relationship.status = UserRelationship.friends;
    }

    if (currentUser.blockedUsers.some((blockedUser) => blockedUser.id === specifyUserId)) {
      relationship.status = UserRelationship.notFriends;
    }

    const sentFriendRequest = currentUser.sentFriendRequests.find(
      (request) => request.receiver.id === specifyUserId
    );

    if (sentFriendRequest) {
      relationship.status = UserRelationship.friendRequestSent;
    }

    const receivedFriendRequest = currentUser.receivedFriendRequests.find(
      (request) => request.sender.id === specifyUserId
    );

    if (receivedFriendRequest) {
      relationship.status = UserRelationship.friendRequestReceived;
    }

    relationship.status = UserRelationship.notFriends;
    return relationship;
  }

  async deleteFriend(user: UserEntity, friendToDeleteId: string): Promise<UserDto> {
    if (!user) {
      throw new Error(`User in deleteFriendByID not found`);
    }

    user.friends = user.friends.filter(
      (friend) => friend.id !== friendToDeleteId,
    );

    return await this.userRepository.save(user);
  }

  async blockUserById(user: UserEntity, userToBlockId: string): Promise<void> {
    const userToBlock = await this.userRepository.findOneById(userToBlockId);

    if (!userToBlock) {
      throw new Error('User to block not found');
    }

    const isUserAlreadyBlocked = user.blockedUsers.some((u) => u.id === userToBlock.id);

    if (isUserAlreadyBlocked) {
      throw new Error('User is already blocked');
    }

    user.blockedUsers.push(userToBlock);
    await this.userRepository.save(user);
  }

  getBlockedUsers(user: UserEntity): UserDto[] {
    return user.blockedUsers;
  }

  async unblockUserById(currentUser: UserEntity, userToUnblockId: string): Promise<void> {
    const userToUnblock = currentUser.blockedUsers.find((u) => u.id === userToUnblockId);
  
    if (!userToUnblock) {
      throw new Error('User to unblock not found');
    }
  
    currentUser.blockedUsers = currentUser.blockedUsers.filter((u) => u.id !== userToUnblock.id);
    await this.userRepository.save(currentUser);
  }
}
