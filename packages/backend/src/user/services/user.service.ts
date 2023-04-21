// Nest dependencies
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

// Local files
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { AuthProvider } from '../../auth/dto/auth-provider.enum';
import { UserDto } from '../dto/user.dto';
import { FriendRequestDto } from '../dto/friend_request.dto';
import { FriendRequest } from '../entities/friend_request.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRelationshipDto } from '../dto/user-relationship.dto';
import { UserRelationship } from '../enum/user-relationship.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: CreateUserDto): Promise<UserDto> {
    return this.userRepository.create(user);
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserDto | void> {
    const user = await this.userRepository.findUserByProviderIDAndProvider(
      providerId,
      provider,
    );

    return user;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return await UserEntity.transformToDtoArray(users);
  }

  async findOne(id: string): Promise<UserEntity | void> {
    return await this.userRepository.findOneById(id);
  }

  async findOneDto(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user.transformToDto();
  }

  async updateOne(
    currentUser: UserEntity,
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    if (currentUser.id !== userId) {
      throw new ForbiddenException('Cannot update another user data');
    }

    currentUser.name = updateUserDto.name;

    return (await this.userRepository.save(currentUser)).transformToDto();
  }

  async getFriendsById(id: string): Promise<UserDto[]> {
    const user = await this.findOneWithRelations(id, ['friends']);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return await UserEntity.transformToDtoArray(user.friends);
  }

  async getSentFriendRequests(
    currentUserId: string,
    userId: string,
  ): Promise<FriendRequestDto[]> {
    if (currentUserId !== userId) {
      throw new ForbiddenException(
        'Cannot access to another user list requests',
      );
    }
    const user = await this.userRepository.findOneByIdWithRelations(userId, [
      'sentFriendRequests',
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return await FriendRequest.transformToDtoArray(user.sentFriendRequests);
  }

  async getReceivedFriendRequests(userId: string): Promise<FriendRequestDto[]> {
    const user = await this.userRepository.findOneByIdWithRelations(userId, [
      'receivedFriendRequests',
    ]);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return user.receivedFriendRequests;
  }

  async sendFriendRequest(
    senderId: string,
    futureFriendId: string,
  ): Promise<void> {
    const receiver = await this.userRepository.findOneByIdWithRelations(
      futureFriendId,
      ['receivedFriendRequests'],
    );
    if (!receiver) {
      throw new NotFoundException(
        `Receiver with ID "${futureFriendId}" not found`,
      );
    }

    const sender = await this.userRepository.findOneByIdWithRelations(
      senderId,
      ['sentFriendRequests', 'sentFriendRequests.receiver'],
    );
    if (!sender) {
      throw new NotFoundException(`Sender with ID "${senderId}" not found`);
    }

    if (sender.id === receiver.id) {
      throw new BadRequestException(`User ${sender.id} send request himself`);
    } else if (
      sender.sentFriendRequests.some((req) => req.receiver.id === receiver.id)
    ) {
      throw new ConflictException(
        `Friend request between users already exists`,
      );
    }

    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;

    sender.sentFriendRequests.push(friendRequest);
    receiver.receivedFriendRequests.push(friendRequest);

    await this.userRepository.saveArray([sender, receiver]);
  }

  async getUserFriendsStatus(
    currentUserId: string,
    specifyUserId: string,
  ): Promise<UserRelationshipDto> {
    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      [
        'blockedUsers',
        'friends',
        'sentFriendRequests',
        'receivedFriendRequests',
        'sentFriendRequests.receiver',
        'receivedFriendRequests.sender',
      ],
    );
    const relationship = new UserRelationshipDto();

    if (!currentUser) {
      throw new NotFoundException(`User with ID "${currentUserId}" not found`);
    }

    if (currentUser.friends.some((friend) => friend.id === specifyUserId)) {
      relationship.status = UserRelationship.friends;
    } else if (
      currentUser.blockedUsers.some(
        (blockedUser) => blockedUser.id === specifyUserId,
      )
    ) {
      relationship.status = UserRelationship.notFriends;
    } else if (
      currentUser.sentFriendRequests.some(
        (request) => request.receiver.id === specifyUserId,
      )
    ) {
      relationship.status = UserRelationship.friendRequestSent;
    } else if (
      currentUser.receivedFriendRequests.some(
        (request) => request.sender.id === specifyUserId,
      )
    ) {
      relationship.status = UserRelationship.friendRequestReceived;
    } else {
      relationship.status = UserRelationship.notFriends;
    }

    return relationship;
  }

  async addNewFriend(
    currentUserId: string,
    newFriendId: string,
  ): Promise<void> {
    const currentUser = await this.findOneWithRelations(currentUserId, [
      'friends',
    ]);
    const friend = await this.findOneWithRelations(newFriendId, ['friends']);

    if (!currentUser || !friend) {
      throw new NotFoundException(`User with ID "${newFriendId}" not found`);
    } else if (currentUserId === newFriendId) {
      throw new BadRequestException(`User cannot add to friends himself`);
    } else if (this.isTwoUsersFriends(currentUser, friend)) {
      throw new BadRequestException('Two users already friends');
    }

    currentUser.friends.push(friend);
    friend.friends.push(currentUser);

    await this.userRepository.saveArray([currentUser, friend]);
  }

  async deleteFriend(
    currentUserId: string,
    friendToDeleteId: string,
  ): Promise<void> {
    const currentUser = await this.findOneWithRelations(currentUserId, [
      'friends',
    ]);
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    const friendToDelete = await this.findOneWithRelations(friendToDeleteId, [
      'friends',
    ]);
    if (!friendToDelete) {
      throw new NotFoundException('Friend to delete not found');
    }

    await this.deleteFriendByEntities(currentUser, friendToDelete);
  }

  async deleteFriendByEntities(
    currentUser: UserEntity,
    friendToDelete: UserEntity,
  ): Promise<void> {
    if (!currentUser.friends) {
      throw new NotFoundException(`Cannot find current user's friend list`);
    } else if (!friendToDelete.friends) {
      throw new NotFoundException(
        `Cannot find friend list of friend to delete`,
      );
    }

    if (
      currentUser.friends.findIndex((user) => user.id === friendToDelete.id) ===
      -1
    ) {
      throw new BadRequestException(`Two users aren't friends`);
    }

    currentUser.friends = currentUser.friends.filter((friend) => {
      friend.id !== friendToDelete.id;
    });

    friendToDelete.friends = friendToDelete.friends.filter((friend) => {
      friend.id !== currentUser.id;
    });

    await this.userRepository.saveArray([currentUser, friendToDelete]);
  }

  async blockUserById(
    currentUserId: string,
    userToBlockId: string,
  ): Promise<void> {
    const userToBlock = await this.userRepository.findOneByIdWithRelations(
      userToBlockId,
      ['friends'],
    );
    if (!userToBlock) {
      throw new NotFoundException(`User to block not found`);
    }

    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      ['blockedUsers', 'friends'],
    );
    if (!currentUser) {
      throw new InternalServerErrorException(`User not found`);
    }

    if (currentUserId == userToBlockId) {
      throw new BadRequestException(`User cannot block himself`);
    }

    const isUserAlreadyBlocked = currentUser.blockedUsers.some(
      (u) => u.id === userToBlock.id,
    );
    if (isUserAlreadyBlocked) {
      return;
    }

    if (
      userToBlock.friends &&
      currentUser.friends &&
      this.isTwoUsersFriends(currentUser, userToBlock)
    ) {
      await this.deleteFriendByEntities(currentUser, userToBlock);
    }

    currentUser.blockedUsers.push(userToBlock);
    await this.userRepository.save(currentUser);
  }

  async getBlockedUsers(
    currentUserId: string,
    userId: string,
  ): Promise<UserDto[]> {
    if (currentUserId !== userId) {
      throw new ForbiddenException(
        'Cannot access to list blocked users of another user',
      );
    }

    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      ['blockedUsers'],
    );

    if (!currentUser) {
      throw new NotFoundException(`User with ID "${currentUserId}" not found`);
    }

    return await UserEntity.transformToDtoArray(currentUser.blockedUsers);
  }

  async unblockUserById(
    currentUserId: string,
    userToUnblockId: string,
  ): Promise<void> {
    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      ['blockedUsers'],
    );

    if (!currentUser) {
      throw new NotFoundException(`User with ID "${currentUserId}" not found`);
    }

    const index = currentUser.blockedUsers.findIndex(
      (u) => u.id === userToUnblockId,
    );
    if (index === -1) {
      throw new BadRequestException(
        `User to unblock "${userToUnblockId}" not in blocked list`,
      );
    }

    currentUser.blockedUsers.splice(index, 1);

    await this.userRepository.save(currentUser);
  }

  async findOneWithRelations(
    id: string,
    relations: string[],
  ): Promise<UserEntity | void> {
    return await this.userRepository.findOneByIdWithRelations(id, relations);
  }

  isTwoUsersFriends(user1: UserEntity, user2: UserEntity): boolean {
    return (
      user1.friends.some((user) => user.id === user2.id) ||
      user2.friends.some((user) => user.id === user1.id)
    );
  }
}
