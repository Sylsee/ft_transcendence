import { Controller, Get, Request, UseGuards, Logger } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { OauthAuthGuard } from './guard/oauth.guard';
import { HttpService } from '@nestjs/axios';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(OauthAuthGuard)
  @Get('login')
  login(@Request() req) {
    this.logger.log('login');
    return this.authService.login(req.user);
  }

  @Get('42')
  auth(@Request() req) {
    // console.log(req.user);
    this.logger.log(req.user);
    return this.usersService.log();
  }

  // @UseGuards(OauthAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
