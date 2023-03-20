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
    this.logger.debug(`Update or create OAuth user with ID: ${profile.id}`);

    const user = await this.findOneById(profile.id);
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
    this.logger.debug(`Create OAuth user with ID: ${profile.id}`);

    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      id: profile.id,
      login: profile.login,
      first_name: profile.usual_first_name
        ? profile.usual_first_name
        : profile.first_name,
      avatar: profile.image.link,
    };
    if (!user) {
      this.logger.error(`Failed to create user with ID: ${profile.id}`);
      throw new InternalServerErrorException();
    }

    this.users.push(user);
    if (!this.users.find((user) => user.id === profile.id)) {
      this.logger.error(
        `Failed to push user with ID: ${profile.id} into users`,
      );
      throw new InternalServerErrorException();
    }

    return user;
  }

  async updateOAuthUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User | undefined> {
    this.logger.debug(`Update OAuth user with ID: ${profile.id}`);

    const user = this.users.find((user) => user.id === profile.id);
    if (!user) {
      this.logger.warn(`Failed to find user with ID: ${profile.id}`);
      throw new InternalServerErrorException();
    }

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    this.logger.debug(`User with ID: ${profile.id} updated`);
    return user;
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }
}
