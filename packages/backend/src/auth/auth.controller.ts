import {
  Controller,
  Get,
  Req,
  UseGuards,
  Logger,
  Res,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OAuthGuard } from './guard/oauth.guard';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(OAuthGuard)
  // @ApiOperation({ summary: 'Redirect to 42 authentication api' })
  // @ApiOAuth2(['public'])
  async login() {}

  @Get('42')
  @UseGuards(OAuthGuard)
  // @ApiOperation({ summary: 'Redirection of 42 authentication' })
  // @ApiResponse({ status: 302, description: 'Redirect to 42 api' })
  async redirect(@Req() req, @Res() res: Response) {
    this.logger.debug('TODO: ftAuth42');
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  getProfile(@Req() req) {
    this.logger.debug('getProfile', req.user);
    return req.user;
  }
}
