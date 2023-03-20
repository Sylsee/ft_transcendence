import {
  Controller,
  Get,
  Req,
  UseGuards,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
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
    private readonly configService: ConfigService,
  ) {}

  @Get('login')
  @UseGuards(OAuthGuard)
  async login(@Req() req, @Res() res: Response) {
    this.logger.debug(`User ID: ${req.user.id} requested to log in`);

    const { token, user } = this.authService.login(req.user);

    this.logger.log(`User ID: ${user.id} successfully logged in`);

    res.cookie('token', token, {
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 60 * 1000, // minutes to milliseconds
      httpOnly: this.configService.get<string>('NODE_ENV') === 'production',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      domain:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'frontend'
          : undefined,
      path: '/',
    });
    res.redirect(`${this.configService.get<string>('APP_DOMAIN')}/callback`);
    // res.redirect(`../auth/profile`);
    // this.logger.debug(`JWT: ${token} sent to user ID: ${user.id}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    this.logger.debug(`User ID: ${req.user.id} requested profile information`);

    const user = this.userService.findOneById(req.user.id);
    if (!user) {
      this.logger.warn(`User ID: ${req.user} not found in database`);
      throw new Error('User not found');
    }

    this.logger.debug(`User ID: ${req.user.id} profile information sent`);
    return user;
  }
}
