// Nest dependencies
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Third-party imports
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { adjectives, uniqueNamesGenerator } from 'unique-names-generator';

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
    userDto.name = this.formatUserName(userDto.name);
    userDto.name = await this.getUniqueName(userDto.name);
    userDto.profilePictureUrl = this.getProfilePictureUrl(userDto);

    this.logger.debug(JSON.stringify(userDto, null, 2));

    const user = await this.userRepository.create(userDto);

    await this.downloadProfilePicture(user, userDto);

    return user;
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

  private formatUserName(name: string): string {
    return name.replace(/ /g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
  }

  private async getUniqueName(name: string): Promise<string> {
    if (!(await this.findOneByName(name))) {
      return name;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const randomName = uniqueNamesGenerator({
        dictionaries: [[name], adjectives],
        style: 'capital',
        separator: '-',
        length: 2,
      });
      if (!(await this.findOneByName(randomName))) {
        return randomName;
      }
    }
  }

  private getProfilePictureUrl(userDto: CreateUserDto): string {
    return (
      userDto.profilePictureUrl ||
      `https://ui-avatars.com/api/?background=random&size=128&length=1&bold=true&font-size=0.6&format=png&name=${userDto.name}`
    );
  }

  private async downloadProfilePicture(
    user: UserEntity,
    userDto: CreateUserDto,
  ): Promise<void> {
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
      const response = await axios.get(userDto.profilePictureUrl, {
        responseType: 'arraybuffer',
      });

      writeFile(filePath, response.data);
    } catch (err) {
      this.logger.error(err);
    }

    if (filePath) {
      user.profilePictureUrl = `http://localhost:${this.configService.get<string>(
        'PORT',
      )}/public/profile-pictures/${fileName}`;
      await this.save(user);
    }
  }
}
