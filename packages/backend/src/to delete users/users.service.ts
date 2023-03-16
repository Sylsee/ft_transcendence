import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// TODO: Replace with real database model
export type User = any;

@Injectable()
export class UsersService {
  private users = [];
  private readonly logger = new Logger(UsersService.name);

  async updateOrCreateOAuthUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User> {
    this.logger.debug('Update or Create OAuth User', profile.id);

    const user = await this.findOneByOAuthId(profile.id);
    if (user) {
      return this.updateOAuthUser(accessToken, refreshToken, profile);
    }

    return this.createOAuthUser(accessToken, refreshToken, profile);
  }

  async createOAuthUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User> {
    this.logger.debug('Create OAuth User', profile.id);

    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile,
    };
    if (!user) {
      this.logger.error('Failed to create user');
      throw new InternalServerErrorException();
    }

    this.users.push(user);
    if (!this.users.find((user) => user.profile.id === profile.id)) {
      this.logger.error('Failed to push user in Database');
      throw new InternalServerErrorException();
    }

    return user;
  }

  async updateOAuthUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User | undefined> {
    this.logger.debug('Update OAuth User', profile.id);

    const user = this.users.find((user) => user.profile.id === profile.id);
    if (!user) {
      this.logger.error('Failed to find OAuth user', profile.id);
      throw new InternalServerErrorException();
    }

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    return user;
  }

  async findOneByOAuthId(oauthId: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === oauthId);
  }

  async debug(userId: number): Promise<any> {
    return JSON.stringify(this.users.find((user) => user.id === userId));
  }
}
