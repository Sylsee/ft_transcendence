import { Controller, Get, Req, UseGuards, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OAuthGuard } from './guard/oauth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { UsersService } from '../to delete users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  @UseGuards(OAuthGuard)
  async login(@Req() req) {
    const { token, user } = this.authService.login(req.user);
    this.logger.log(`User ID: ${user.id} successfully logged in`);
    return { token, user };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    this.logger.debug(`User ID: ${req.user.id} requested profile information`);

    const user = this.userService.findOneById(req.user.id);
    if (!user) {
      this.logger.warn(`User ID: ${req.user} not found`);
      throw new Error('User not found');
    }

    this.logger.debug(`User ID: ${req.user.id} profile information sent`);
    return user;
  }
}
