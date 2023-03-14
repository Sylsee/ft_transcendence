import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, UsersService } from '../to delete users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user): Promise<User> {
    this.logger.debug('Login', user);

    const payload = { username: user.profile.login, sub: user.profile.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.profile.id,
        login: user.profile.login,
        avatar: user.profile.image.link,
      },
    };
  }

  async validateOAuthUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<User | undefined> {
    this.logger.debug('Validate OAuth User');

    try {
      return this.usersService.updateOrCreateOAuthUser(
        accessToken,
        refreshToken,
        profile,
      );
    } catch (error) {
      this.logger.error('Failed to validate OAuth user', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async debug(userId: number): Promise<any> {
    this.logger.debug(
      `AuthService debug user: ${this.usersService.debug(userId)}`,
    );
  }
}
