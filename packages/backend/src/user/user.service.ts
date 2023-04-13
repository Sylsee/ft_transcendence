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
    
    return await this.userRepository.save(user);
  }

  getFriendsById(id: string): Promise<UserDto[]> {
    return this.userRepository.getFriendsById(id);
  }

  async getSentFriendRequests(userId: string): Promise<FriendRequestDto[]> {
    const user = await this.userRepository.findOneByIdWithRelations(userId, ['sentFriendRequests']);
    if (!user) {
      return [];
    }

    return user.sentFriendRequests;
  }

  async getReceivedFriendRequests(userId: string): Promise<FriendRequestDto[]> {
    const user = await this.userRepository.findOneByIdWithRelations(userId, ['receivedFriendRequests']);
    if (!user) {
      return [];
    }

    return user.receivedFriendRequests;
  }

  async sendFriendRequest(senderId: string, futureFriendId: string): Promise<void> {
    const receiver = await this.userRepository.findOneByIdWithRelations(futureFriendId, ['receivedFriendRequests']);
    const sender = await this.userRepository.findOneByIdWithRelations(senderId, ['sentFriendRequests']);

    if (!receiver || !sender) {
      throw new Error(`User with ID ${futureFriendId} not found`);
    } else if (sender.id === receiver.id) {
      throw new Error(`User ${sender.id} send request himself`);
    }

    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;

    sender.sentFriendRequests.push(friendRequest);
    receiver.receivedFriendRequests.push(friendRequest);

    await this.userRepository.saveArray([sender, receiver]);
  }

  async getUserFriendsStatus(currentUserId: string, specifyUserId: string): Promise<UserRelationshipDto> {
    const currentUser = 
      await this.userRepository.findOneByIdWithRelations(currentUserId, ['blockedUsers', 'friends', 'sentFriendRequests', 'receivedFriendRequests']);
    let relationship = new UserRelationshipDto();

    if (!currentUser) {
      throw new Error('Error: in getUserFriendsStatus(): users not found');
    }

    if (currentUser.friends.some((friend) => friend.id === specifyUserId)) {
      relationship.status = UserRelationship.friends;
    } else if (currentUser.blockedUsers.some((blockedUser) => blockedUser.id === specifyUserId)) {
      relationship.status = UserRelationship.notFriends;
    } else if (currentUser.sentFriendRequests.some((request) => request.receiver.id === specifyUserId)) {
      relationship.status = UserRelationship.friendRequestSent;
    } else if (currentUser.receivedFriendRequests.some((request) => request.sender.id === specifyUserId)) {
      relationship.status = UserRelationship.friendRequestReceived;
    } else {
      relationship.status = UserRelationship.notFriends;
    }

    return relationship;
  }

  async addNewFriend(currentUserId: string, newFriendId: string): Promise<void> {
    const currentUser = await this.findOneWithRelations(currentUserId, ['friends']);
    const friend = await this.findOneWithRelations(newFriendId, ['friends']);

    if (!currentUser || !friend) {
      throw new Error("Error: in addNewFriend(): currentUser or friend not found");
    }

    const isAlreadyFriends = currentUser.friends.some(user => {user.id === newFriendId}) 
    || friend.friends.some(user => {user.id === currentUserId});

    if (isAlreadyFriends) {
      return;
    }

    currentUser.friends.push(friend);
    friend.friends.push(currentUser);

    await this.userRepository.saveArray([currentUser, friend]);
  }

  async deleteFriend(currentUserId: string, friendToDeleteId: string): Promise<UserDto[]> {
    const currentUser = await this.findOneWithRelations(currentUserId, ['friends']);
    if (!currentUser) {
      throw new Error('In deleteFriend(): users not found');
    }

    if (currentUser.friends.some((friend) => friend.id === friendToDeleteId)) {
      const friendToDelete = await this.findOneWithRelations(friendToDeleteId, ['friends']);
      if (!friendToDelete) {
        throw new Error('In deleteFriend(): users not found');
      }

      currentUser.friends = currentUser.friends.filter(
        (friend) => friend.id !== friendToDeleteId,
      )
      friendToDelete.friends = friendToDelete.friends.filter(
        (friend) => friend.id !== currentUserId,
      )

      return await this.userRepository.saveArray([currentUser, friendToDelete]);
    }
  }

  async deleteFriendByEntities(currentUser: UserEntity, friendToDelete: UserEntity): Promise<void> {
    if (!currentUser.friends || !friendToDelete.friends) {
      throw new Error("Error: in deleteFriendWithByEntities: currentUser.friends or friendToDelete.friend not specified");
    }

    currentUser.friends = currentUser.friends.filter(
      friend => {friend.id !== friendToDelete.id}
    );

    friendToDelete.friends = friendToDelete.friends.filter(
      friend => {friend.id !== currentUser.id}
    )

    await this.userRepository.saveArray([currentUser, friendToDelete]);
  }

  async blockUserById(currentUserId: string, userToBlockId: string): Promise<void> {
    const userToBlock = await this.userRepository.findOneById(userToBlockId);
    const currentUser = await this.userRepository.findOneByIdWithRelations(currentUserId, ['blockedUsers', 'friends']);

    if (!userToBlock || !currentUser) {
      throw new Error('User to block not found');
    }

    const isUserAlreadyBlocked = currentUser.blockedUsers.some((u) => u.id === userToBlock.id);
    if (isUserAlreadyBlocked) {
      return;
    }

    const isUserFriend = currentUser.friends.some((u) => u.id === userToBlock.id);
    if (isUserFriend) {
        this.deleteFriendByEntities(currentUser, userToBlock);
    }

    currentUser.blockedUsers.push(userToBlock);
    await this.userRepository.save(currentUser);
  }

  async getBlockedUsers(currentUserId: string): Promise<UserDto[]> {
    const currentUser = await this.userRepository.findOneByIdWithRelations(currentUserId, ['blockedUsers']);
    if (!currentUser) {
      throw new Error('Error: in getBlockUsers: current User not found');
    }

    return currentUser.blockedUsers;
  }

  async unblockUserById(currentUserId: string, userToUnblockId: string): Promise<void> {
    const currentUser = await this.userRepository.findOneByIdWithRelations(currentUserId, ['blockedUsers']);
    if (!currentUser) {
      throw new Error('Error: in unblockUserById: current User not found');
    }
  
    currentUser.blockedUsers = currentUser.blockedUsers.filter((u) => u.id !== userToUnblockId);
    await this.userRepository.save(currentUser);
  }

  async findOneWithRelations(
    id: string,
    relations: string[],
  ): Promise<UserEntity | void> {
    return await this.userRepository.findOneByIdWithRelations(id, relations);
  }
}
