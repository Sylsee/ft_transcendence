// NestJS imports
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

// Local imports
import { AuthProvider } from 'src/auth/enum/auth-provider.enum';
import { MatchDto } from 'src/game/dto/game-dto';
import { userIdInList } from 'src/shared/list';
import {
  downloadProfilePicture,
  getProfilePictureUrlByDto,
} from 'src/shared/profile-picture';
import { formatUserName, getUniqueName } from 'src/shared/username';
import { CreateUserDto } from '../dto/create-user.dto';
import { FriendRequestsDto } from '../dto/relationship/friend-requests.dto';
import { UserRelationshipDto } from '../dto/relationship/user-relationship.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRelationship } from '../enum/user-relationship.enum';
import { UserRepository } from '../repositories/user.repository';
import { FriendRequestService } from './friend_request.service';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  private socketUserMap = new Map<string, string>(); // socketId -> userId

  constructor(
    private readonly userRepository: UserRepository,
    private friendRequestService: FriendRequestService,
  ) {}

  // TODO: Remove this method
  findAll() {
    return this.userRepository.find();
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    userDto.name = formatUserName(userDto.name);
    userDto.name = await getUniqueName(userDto.name, this);
    userDto.profilePictureUrl = getProfilePictureUrlByDto(userDto);

    const user = await this.userRepository.create(userDto);

    await downloadProfilePicture(user, userDto, this);

    return user;
  }

  update(userId: string, content: object): void {
    this.userRepository.update(userId, content);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async findOneWithRelations(
    id: string,
    relations: string[],
  ): Promise<UserEntity | void> {
    return await this.userRepository.findOneByIdWithRelations(id, relations);
  }

  async findOneById(id: string): Promise<UserEntity | void> {
    return this.userRepository.findOneById(id);
  }

  async findOneByName(username: string): Promise<UserEntity | void> {
    return this.userRepository.findOneByName(username);
  }

  async findUserByProviderIDAndProvider(
    providerId: string,
    provider: AuthProvider,
  ): Promise<UserEntity | void> {
    return this.userRepository.findUserByProviderIDAndProvider(
      providerId,
      provider,
    );
  }

  async updateName(
    currentUser: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    if (await this.findOneByName(updateUserDto.name)) {
      throw new ConflictException('Username already taken');
    }

    currentUser.name = updateUserDto.name;
    const updatedUser = await this.userRepository
      .save(currentUser)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
    if (!updatedUser) {
      throw new InternalServerErrorException('Could not update user name');
    }

    return UserDto.transform(updatedUser);
  }

  // -----------------------------------------------------------
  // ---------------------- Relationships ----------------------
  // -----------------------------------------------------------

  async getFriendsById(
    currentUser: UserEntity,
    id: string,
  ): Promise<UserDto[]> {
    const user = await this.findOneWithRelations(id, [
      'friends',
      'friends.friends',
    ]);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.transformToDtoArray(user.friends, currentUser);
  }

  async getFriendRequests(userId: string): Promise<FriendRequestsDto> {
    const user = await this.userRepository.findOneByIdWithRelations(userId, [
      'sentFriendRequests',
      'sentFriendRequests.receiver',
      'receivedFriendRequests',
      'receivedFriendRequests.sender',
    ]);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // prettier-ignore
    const sentRequestDtos: UserDto[] = user.sentFriendRequests.map(
      (request) => UserDto.transform(request.receiver),
    );
    const receivedRequestDtos: UserDto[] = user.receivedFriendRequests.map(
      (request) => UserDto.transform(request.sender),
    );

    return {
      received: receivedRequestDtos,
      sent: sentRequestDtos,
    };
  }

  async sendFriendRequest(
    senderId: string,
    futureFriendId: string,
  ): Promise<void> {
    if (senderId === futureFriendId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    const receiver = await this.userRepository.findOneByIdWithRelations(
      futureFriendId,
      ['receivedFriendRequests', 'blockedUsers'],
    );
    if (!receiver) {
      throw new NotFoundException('User not found');
    }

    const sender = await this.userRepository.findOneByIdWithRelations(
      senderId,
      [
        'sentFriendRequests',
        'sentFriendRequests.receiver',
        'receivedFriendRequests',
        'receivedFriendRequests.sender',
        'blockedUsers',
      ],
    );
    if (!sender) {
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    if (
      sender.sentFriendRequests.some((req) => req.receiver.id === receiver.id)
    ) {
      throw new ConflictException(`Friend request already sent`);
    } else if (
      userIdInList(receiver.blockedUsers, sender.id) ||
      userIdInList(sender.blockedUsers, receiver.id)
    ) {
      throw new ForbiddenException('Cannot send friend request to this user');
    }

    if (
      sender.receivedFriendRequests.some((req) => req.sender.id === receiver.id)
    ) {
      await this.addNewFriend(senderId, futureFriendId);
      return;
    }

    await this.friendRequestService.create(sender, receiver);
  }

  async getFriendStatus(
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
    if (!currentUser) {
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    const relationship = new UserRelationshipDto();

    if (userIdInList(currentUser.friends, specifyUserId)) {
      relationship.status = UserRelationship.friends;
    } else if (userIdInList(currentUser.blockedUsers, specifyUserId)) {
      relationship.status = UserRelationship.block;
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
    if (currentUserId === newFriendId) {
      throw new BadRequestException('Cannot add yourself as a friend');
    }

    const currentUser = await this.findOneWithRelations(currentUserId, [
      'friends',
    ]);
    if (!currentUser) {
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    const friend = await this.findOneWithRelations(newFriendId, ['friends']);
    if (!friend) {
      throw new NotFoundException(`User not found`);
    }

    if (this.areUsersFriends(currentUser, friend)) {
      throw new BadRequestException('Users are already friends');
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
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    const friendToDelete = await this.findOneWithRelations(friendToDeleteId, [
      'friends',
    ]);
    if (!friendToDelete) {
      throw new NotFoundException('User not found');
    }

    await this.deleteFriendByEntities(currentUser, friendToDelete);
  }

  async deleteFriendByEntities(
    currentUser: UserEntity,
    friendToDelete: UserEntity,
  ): Promise<void> {
    if (!currentUser.friends || !friendToDelete.friends) {
      this.logger.warn('Friend list not found for one of the users');
      return;
    }

    currentUser.friends = currentUser.friends.filter((friend) => {
      return friend.id !== friendToDelete.id;
    });
    friendToDelete.friends = friendToDelete.friends.filter((friend) => {
      return friend.id !== currentUser.id;
    });

    await this.userRepository.saveArray([currentUser, friendToDelete]);
  }

  areUsersFriends(user1: UserEntity, user2: UserEntity): boolean {
    return (
      user1.friends.some((user) => user.id === user2.id) ||
      user2.friends.some((user) => user.id === user1.id)
    );
  }

  async blockUserById(
    currentUserId: string,
    userToBlockId: string,
  ): Promise<void> {
    if (currentUserId === userToBlockId) {
      throw new BadRequestException(`User cannot block himself`);
    }

    const userToBlock = await this.userRepository.findOneByIdWithRelations(
      userToBlockId,
      ['friends'],
    );
    if (!userToBlock) {
      throw new NotFoundException(`User to block not found`);
    }

    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      [
        'blockedUsers',
        'friends',
        'receivedFriendRequests',
        'receivedFriendRequests.sender',
        'sentFriendRequests',
        'sentFriendRequests.receiver',
      ],
    );
    if (!currentUser) {
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    const isUserAlreadyBlocked = currentUser.blockedUsers.some(
      (u) => u.id === userToBlock.id,
    );
    if (isUserAlreadyBlocked) {
      throw new BadRequestException(`User is already blocked`);
    }

    if (userIdInList(currentUser.friends, userToBlock.id)) {
      await this.deleteFriendByEntities(currentUser, userToBlock);
    }

    if (
      currentUser.receivedFriendRequests.some(
        (user) => user.sender.id === userToBlock.id,
      )
    ) {
      await this.friendRequestService.deleteFriendRequest(
        userToBlock.id,
        currentUser.id,
      );
    } else if (
      currentUser.sentFriendRequests.some(
        (user) => user.receiver.id === userToBlock.id,
      )
    ) {
      await this.friendRequestService.deleteFriendRequest(
        currentUser.id,
        userToBlock.id,
      );
    }

    currentUser.blockedUsers.push(userToBlock);
    await this.userRepository.save(currentUser);
  }

  async getBlockedUsers(currentUserId: string): Promise<UserDto[]> {
    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      ['blockedUsers'],
    );
    if (!currentUser) {
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    return await this.transformToDtoArray(currentUser.blockedUsers);
  }

  async unblockUserById(
    currentUserId: string,
    userToUnblockId: string,
  ): Promise<void> {
    if (currentUserId === userToUnblockId) {
      throw new BadRequestException(`User cannot unblock himself`);
    }

    const currentUser = await this.userRepository.findOneByIdWithRelations(
      currentUserId,
      ['blockedUsers'],
    );
    if (!currentUser) {
      this.logger.error('Sender not found after authentication');
      throw new InternalServerErrorException();
    }

    if (!userIdInList(currentUser.blockedUsers, userToUnblockId)) {
      throw new BadRequestException(`User is not blocked`);
    }

    currentUser.blockedUsers = currentUser.blockedUsers.filter(
      (user) => user.id !== userToUnblockId,
    );
    await this.userRepository.save(currentUser);
  }

  async findUsersNotBlockingUser(
    userId: string,
    users: UserEntity[],
  ): Promise<UserEntity[]> {
    const userIds = users.map((user) => user.id);

    const blockingUsers = await this.userRepository.findUsersBlocking(
      userId,
      userIds,
    );
    if (!blockingUsers) {
      return users;
    }

    return users.filter((user) => {
      return !blockingUsers?.some(
        (blockingUser) => blockingUser.id === user.id,
      );
    });
  }

  // -----------------------------------------------------------
  // --------------------------- 2fa ---------------------------
  // -----------------------------------------------------------

  async turnOn2fa(user: UserEntity): Promise<any> {
    user.isTwoFactorAuthEnabled = true;
    return this.userRepository.save(user);
  }

  async turnOff2fa(user: UserEntity): Promise<any> {
    user.twoFactorAuthSecret = null;
    user.isTwoFactorAuthEnabled = false;
    return this.userRepository.save(user);
  }

  // -----------------------------------------------------------
  // ------------------------- Game ----------------------------
  // -----------------------------------------------------------

  async getUserGameHistory(id: UserEntity['id']): Promise<MatchDto[]> {
    // TODO: do we want to make the history only visible to friends?
    const user = await this.userRepository.findOneByIdWithRelations(id, [
      'matches',
      'matches.winner',
      'matches.player1',
      'matches.player2',
    ]);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user.matches.map((match) => MatchDto.transform(match));
  }

  // -----------------------------------------------------------
  // ------------------------- Socket --------------------------
  // -----------------------------------------------------------

  getSocketMap(): Map<string, string> {
    return this.socketUserMap;
  }

  setSocketUser(socketId: string, userId: string): void {
    this.socketUserMap.set(socketId, userId);
  }

  removeSocketUser(socketId: string): void {
    this.socketUserMap.delete(socketId);
  }

  async getUserBySocket(socketId: string): Promise<UserEntity | void> {
    const userId = this.findUserIdBySocketId(socketId);
    if (userId) {
      return this.findOneById(userId);
    }
  }

  private findUserIdBySocketId(socketId: string): string | undefined {
    return this.socketUserMap.get(socketId);
  }

  async getSocketId(userId: string): Promise<string | undefined> {
    for (const [socketId, id] of this.socketUserMap.entries()) {
      if (id === userId) {
        return socketId;
      }
    }
    return undefined;
  }

  // -----------------------------------------------------------
  // ------------------------- Utils ---------------------------
  // -----------------------------------------------------------

  transformToDtoArray(
    users: UserEntity[],
    requestUser: UserEntity = undefined,
  ): Promise<UserDto[]> {
    return Promise.all(
      users.map((user) => UserDto.transform(user, requestUser)),
    );
  }
}
