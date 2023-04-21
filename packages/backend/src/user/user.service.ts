// Nest dependencies
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Third-party imports
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Local imports
import { AuthProvider } from '../auth/enum/auth-provider.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserStatus } from './enum/user-status.enum';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  private socketUserMap = new Map<string, string>(); // socketId -> userId

  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    userDto.profilePictureUrl =
      userDto.profilePictureUrl ||
      `https://ui-avatars.com/api/?background=random&size=128&length=1&bold=true&font-size=0.6&format=png&name=${userDto.name}`;

    const user = await this.userRepository.create(userDto);

    const profilePicture = await axios.get(userDto.profilePictureUrl, {
      responseType: 'arraybuffer',
    });

    const filePath = this.writeProfilePicture(user, profilePicture);

    if (filePath) {
      user.profilePictureUrl = `http://localhost:${this.configService.get<string>(
        'PORT',
      )}${filePath}`;
      await this.save(user);
    }

    return user;
  }

  private writeProfilePicture(
    user: UserEntity,
    profilePicture: any,
  ): string | undefined {
    const fileName = `${user.id}.png`;
    const filePath = join(
      __dirname,
      '..',
      '..',
      'public',
      'profile-pictures',
      fileName,
    );

    try {
      writeFile(filePath, profilePicture.data);
    } catch (err) {
      this.logger.error(err);
      return undefined;
    }

    return `/public/profile-pictures/${fileName}`;
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

  // -------------------- Socket Methods ------------------------

  getSockets(): string[] {
    return Array.from(this.socketUserMap.keys());
  }

  getSocketMap(): Map<string, string> {
    return this.socketUserMap;
  }

  setSocketUser(socketId: string, userId: string): void {
    this.socketUserMap.set(socketId, userId);
  }

  removeSocketUser(socketId: string): void {
    this.socketUserMap.delete(socketId);
  }

  setUserStatus(userId: string, status: UserStatus): void {
    this.userRepository.setUserStatus(userId, status);
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
