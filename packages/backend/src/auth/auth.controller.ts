// NestJS imports
import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
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
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(OAuth42Guard)
  @ApiOperation({ summary: 'Authenticate using 42' })
  @ApiCookieAuth()
  @ApiResponse({ status: 302, description: 'Successful login' })
  async signIn42(@Req() req, @Res() res: Response) {
    this.authService.signIn(res, req.user);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Authenticate using Google' })
  @ApiCookieAuth()
  @ApiResponse({ status: 302, description: 'Successful login' })
  async signInGoogle(@Req() req, @Res() res: Response) {
    this.authService.signIn(res, req.user);
  }
}
