import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ftUserResponseDto } from './dto/ft-user-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  login(user) {
    this.logger.debug(`Processing login request for user with ID: ${user.id}`);

    const payload = { sub: user.id, username: user.login };
    const token = this.jwtService.sign(payload);
    const responseUser = {
      id: user.id,
      login: user.login,
      avatar: user.avatar,
    };

    this.logger.debug(`Login request processed for user with ID: ${user.id}`);
    return { token, user: responseUser };
  }

  async validateOAuthUser(
    profile: ftUserResponseDto,
  ): Promise<User | undefined> {
    this.logger.debug('Validating OAuth User');

    try {
      const user = await this.userService.createOAuthUser(profile);

      this.logger.debug(`OAuth user with ID: ${user.id} validated`);
      return user;
    } catch (error) {
      this.logger.warn('Failed to validate OAuth user', error.stack);
      throw new InternalServerErrorException();
    }
  }
}
