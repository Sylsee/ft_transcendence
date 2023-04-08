// NestJS imports
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Express imports
import { Response } from 'express';

// Local imports
import { AuthService } from './auth.service';
import { OAuth42Guard } from './guard/42-oauth.guard';
import { GoogleOauthGuard } from './guard/google-oauth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(OAuth42Guard)
  @ApiOperation({ summary: 'Authenticate using 42' })
  @ApiResponse({ status: 302, description: 'Successful login' })
  async signIn42(@Req() req, @Res() res: Response) {
    await this.authService.signIn(res, req.user);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Authenticate using Google' })
  @ApiResponse({ status: 302, description: 'Successful login' })
  async signInGoogle(@Req() req, @Res() res: Response) {
    await this.authService.signIn(res, req.user);
  }
}
