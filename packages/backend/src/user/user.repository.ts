// NestJS imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party imports
import { Repository } from 'typeorm';

// Local files
import { AuthProvider } from '../auth/dto/auth-provider.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { FriendRequest } from './entities/friend_request.entity';
import { FriendRequestStatus } from './enum/friend_request-status.enum';
import { UserRelationship } from './enum/user-relationship.enum';
import { UserDto, UserRelationshipDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });

    return await this.userRepository.save(newUser);
  }

  async find(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { providerId, provider },
    });
  }

  async findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async updateOne(userId: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneById(userId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    user.name = updateUserDto.name;
    
    return this.userRepository.save(user);
  }

  async getFriendsById(userId: string): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friend')
      .where('user.id = :id', { id: userId })
      .getMany();

    const user = await queryBuilder;
    return user[0].friends;
  }

  async deleteFriendById(user: UserEntity, friendForDeleteId: string): Promise<UserEntity> {
    

    if (!user) {
      throw new Error(`User in deleteFriendByID not found`);
    }

    user.friends = user.friends.filter(
      (friend) => friend.id !== friendForDeleteId,
    );

    return await this.userRepository.save(user);
  }

  async sendFriendRequest(sender: UserEntity, futureFriendId: string): Promise<FriendRequest> {
    const receiver = await this.findOneById(futureFriendId);

    if (!receiver) {
      throw new Error(`User with ID ${futureFriendId} not found`);
    }

    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;

    sender.sentFriendRequests.push(friendRequest);
    receiver.receivedFriendRequests.push(friendRequest);

    await this.userRepository.save([sender, receiver]);
    return friendRequest;
  }

  async updateFriendRequestStatus(
    friendRequestId: string,
    newStatus: FriendRequestStatus,
  ): Promise<void> {}

  async getSentFriendRequests(id: string): Promise<FriendRequest[]> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['sentFriendRequests'],
    });
    return user.sentFriendRequests;
  }

  async getReceivedFriendRequests(userId: string): Promise<FriendRequest[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['receivedFriendRequests'],
    });
    return user.receivedFriendRequests;
  }

  async getUserFriendsStatus(currentUser: UserEntity, specifyUserId: string): Promise<UserRelationshipDto> {
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

  async blockUserById(user: UserEntity, userToBlockId: string): Promise<void> {
    const userToBlock = await this.findOneById(userToBlockId);

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

  async getBlockedUsers(user: UserEntity): Promise<UserEntity[]> {
    return user.blockedUsers;
  }

  async unblockUserById(user: UserEntity, userToUnblockId): Promise<void> {
    const userToUnblock = user.blockedUsers.find((u) => u.id === userToUnblockId);
  
    if (!userToUnblock) {
      throw new Error('User to unblock not found');
    }
  
    user.blockedUsers = user.blockedUsers.filter((u) => u.id !== userToUnblock.id);
    await this.userRepository.save(user);
  }
}
