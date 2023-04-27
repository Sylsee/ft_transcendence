// NestJS imports
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiMovedPermanentlyResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Express imports
import { Response } from 'express';

// Local imports
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { GeneratedTwoFactorAuth } from './dto/generate2fa.dto';
import { TwoFactorAuthDto } from './dto/twoFactorAuth.dto';
import { OAuth42Guard } from './guard/42-oauth.guard';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('42')
  @UseGuards(OAuth42Guard)
  @ApiOperation({ summary: 'Authenticate using 42' })
  @ApiMovedPermanentlyResponse({ description: 'Successful login' })
  async signIn42(@Req() req: any, @Res() res: Response) {
    await this.authService.signIn(res, req.user, false);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Authenticate using Google' })
  @ApiMovedPermanentlyResponse({ description: 'Successful login' })
  async signInGoogle(@Req() req: any, @Res() res: Response) {
    await this.authService.signIn(res, req.user, false);
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate 2FA QrCode' })
  @ApiOkResponse({ description: 'Successful generation' })
  async generate2faCode(@Req() req: any): Promise<GeneratedTwoFactorAuth> {
    return await this.authService.generate2faCode(req.user);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Turn on 2FA' })
  @ApiOkResponse({ description: 'Successful verification' })
  @ApiUnauthorizedResponse({ description: 'Invalid 2FA code' })
  async turnOn2fa(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: TwoFactorAuthDto,
  ) {
    const isCodeValid = this.authService.verify2faCode(req.user, body.code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    const user = await this.userService.turnOn2fa(req.user);
    await this.authService.signIn(res, user, true, false);
    return res.send();
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Turn off 2FA' })
  @ApiOkResponse({ description: 'Successful verification' })
  @ApiUnauthorizedResponse({ description: 'Invalid 2FA code' })
  async turnOff2fa(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: TwoFactorAuthDto,
  ) {
    const isCodeValid = this.authService.verify2faCode(req.user, body.code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    const user = await this.userService.turnOff2fa(req.user);
    await this.authService.signIn(res, user, false, false);
    return res.send();
  }

  @Post('2fa/authenticate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify 2FA code' })
  @ApiOkResponse({ description: 'Successful verification' })
  @ApiUnauthorizedResponse({ description: 'Invalid 2FA code' })
  async authenticate(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: TwoFactorAuthDto,
  ) {
    const isCodeValid = this.authService.verify2faCode(req.user, body.code);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    await this.authService.signIn(res, req.user, true, false);
    return res.send(req.user);
  }
}
