// NestJS imports
import { Controller, Get, Req, UseGuards, Logger, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Express imports
import { Response } from 'express';

// Local imports
import { OAuth42Guard } from './guard/42-oauth.guard';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('42')
  @UseGuards(OAuth42Guard)
  @ApiOperation({ summary: 'Authenticate using 42' })
  @ApiCookieAuth()
  @ApiResponse({ status: 302, description: 'Successful login' })
  async login42(@Req() req, @Res() res: Response) {
    const { token, user } = this.authService.signIn(req.user);

    this.logger.log(`User ID: ${user.id} successfully logged in`);

    res.cookie('access_token', token, {
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 60 * 1000, // minutes to milliseconds
      httpOnly: this.configService.get<string>('NODE_ENV') === 'production',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      domain:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'frontend'
          : undefined,
      path: '/',
    });

    res.redirect(
      `${this.configService.get<string>('APP_DOMAIN')}/callback${
        req.user.new ? '?new=true' : ''
      }`,
    );
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Authenticate using Google' })
  @ApiCookieAuth()
  @ApiResponse({ status: 302, description: 'Successful login' })
  async loginGoogle(@Req() req, @Res() res: Response) {
    const { token, user } = this.authService.signIn(req.user);

    this.logger.log(`User ID: ${user.id} successfully logged in`);

    res.cookie('access_token', token, {
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 60 * 1000, // minutes to milliseconds
      httpOnly: this.configService.get<string>('NODE_ENV') === 'production',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      domain:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'frontend'
          : undefined,
      path: '/',
    });

    res.redirect(
      `${this.configService.get<string>('APP_DOMAIN')}/callback${
        req.user.new ? '?new=true' : ''
      }`,
    );
  }
}
