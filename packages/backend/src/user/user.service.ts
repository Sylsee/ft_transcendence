// Nest dependencies
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
    userDto.profilePictureUrl = this.getProfilePictureUrlByDto(userDto);

    const user = await this.userRepository.create(userDto);

    await this.downloadProfilePicture(user, userDto);

    return user;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
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

  // --------------------- 2fa Methods ----------------------

  async turnOn2fa(user: UserEntity): Promise<any> {
    user.isTwoFactorAuthEnabled = true;
    return this.userRepository.save(user);
  }

  async turnOff2fa(user: UserEntity): Promise<any> {
    user.twoFactorAuthSecret = null;
    user.isTwoFactorAuthEnabled = false;
    return this.userRepository.save(user);
  }

  // -------------------- Socket Methods --------------------

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

  getProfilePictureUrl(filename: string): string {
    return `${this.configService.get(
      'APP_DOMAIN',
    )}/uploads/profile-pictures/${filename}`;
  }

  getProfilePicturePath(filename: string): string {
    return join(__dirname, '..', '..', 'uploads', 'profile-pictures', filename);
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

  private getProfilePictureUrlByDto(userDto: CreateUserDto): string {
    return (
      userDto.profilePictureUrl ||
      `https://ui-avatars.com/api/?background=random&size=128&length=1&bold=true&font-size=0.6&format=png&name=${userDto.name}`
    );
  }

  private async downloadProfilePicture(
    user: UserEntity,
    userDto: CreateUserDto,
  ): Promise<void> {
    try {
      const response = await axios.get(userDto.profilePictureUrl, {
        responseType: 'arraybuffer',
      });

      // Check if the response is a valid profile picture type
      if (!this.isValidProfilePictureType(response.headers['content-type'])) {
        // Get the new profile picture url with the ui-avatars api
        const oldProfilePictureUrl = user.profilePictureUrl;
        userDto.profilePictureUrl = null;
        userDto.profilePictureUrl = this.getProfilePictureUrlByDto(userDto);

        if (oldProfilePictureUrl === userDto.profilePictureUrl) {
          throw new InternalServerErrorException(
            'The profile picture url is not valid',
          );
        }

        await this.downloadProfilePicture(user, userDto);
        return;
      }

      const fileName = user.id;
      const filePath = this.getProfilePicturePath(fileName);

      await writeFile(filePath, response.data);

      if (filePath) {
        user.profilePictureUrl = this.getProfilePictureUrl(fileName);
        await this.save(user);
      }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Error downloading profile picture',
      );
    }
  }

  private isValidProfilePictureType(contentType: string): boolean {
    const validContentTypes = new Set(['jpg', 'jpeg', 'png', 'gif']);
    return Array.from(validContentTypes).some((type) =>
      contentType.includes(type),
    );
  }
}
