// Nest dependencies
import { Injectable, Logger } from '@nestjs/common';

// Local imports
import {
  downloadProfilePicture,
  getProfilePictureUrlByDto,
} from 'src/shared/profile-picture';
import { formatUserName, getUniqueName } from 'src/shared/username';
import { AuthProvider } from '../auth/enum/auth-provider.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private socketUserMap = new Map<string, string>(); // socketId -> userId

  constructor(private userRepository: UserRepository) {}

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

  // TODO: Remove this method
  findAll() {
    return this.userRepository.find();
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

  // ---------------------- 2fa ----------------------

  async turnOn2fa(user: UserEntity): Promise<any> {
    user.isTwoFactorAuthEnabled = true;
    return this.userRepository.save(user);
  }

  async turnOff2fa(user: UserEntity): Promise<any> {
    user.twoFactorAuthSecret = null;
    user.isTwoFactorAuthEnabled = false;
    return this.userRepository.save(user);
  }

  // -------------------- Socket --------------------

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

  async getSocketID(userId: string): Promise<string | undefined> {
    for (const [socketId, id] of this.socketUserMap.entries()) {
      if (id === userId) {
        return socketId;
      }
    }
    return undefined;
  }

  async findUsersNotBlockingUser(
    users: UserEntity[],
    userId: string,
  ): Promise<UserEntity[]> {
    const blockingUsers = await this.findBlockingBy(userId);
    if (!blockingUsers) return users;
    return users.filter((user) => !blockingUsers.includes(user));
  }

  async findBlockingBy(userId: string): Promise<UserEntity[] | void> {
    return this.userRepository.findBlockingBy(userId);
  }
}
