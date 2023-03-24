// NestJS imports
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Local imports
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async findOrCreateUser(profile: any): Promise<any | undefined> {
    const userExists = await this.userService.findUserByEmailAndProvider(
      profile.email,
      profile.provider,
    );

    if (!userExists) {
      const user = await this.userService.create(profile);
      return { ...user, new: true };
    }

    return { ...userExists, new: false };
  }

  signIn(user) {
    this.logger.debug(`Processing login request for user with ID: ${user.id}`);

    const payload = { sub: user.id };
    const token = this.jwtService.sign(payload);
    const responseUser = {
      id: user.id,
      login: user.login,
      avatar: user.avatar,
    };

    this.logger.debug(`Login request processed for user with ID: ${user.id}`);
    return { token, user: responseUser };
  }
}
