// NestJS imports
import { Injectable, Logger, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// Third-party imports
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GeneratedTwoFactorAuth } from './dto/generate2fa.dto';
import { Jwt2faStrategy } from './strategy/jwt-2fa.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private jwt2faStrategy: Jwt2faStrategy,
  ) {}

  async findOrCreateUser(profile: any): Promise<any | undefined> {
    const user = await this.userService.findUserByProviderIDAndProvider(
      profile.providerId,
      profile.provider,
    );

    if (!user) {
      const newUser = await this.userService.create(profile);
      return { ...newUser, new: true };
    }

    return { ...user, new: false };
  }

  async signIn(
    @Res() res: Response,
    user: UserEntity,
    redirect = true,
  ): Promise<void> {
    const payload = { sub: user.id };

    this.setJwtCookie(res, user, payload);
    if (redirect) {
      this.signInRedirect(res, user);
    }
  }

  async signInWith2fa(
    @Res() res: Response,
    user: UserEntity,
    redirect = true,
  ): Promise<void> {
    const payload = {
      sub: user.id,
      isTwoFactorAuthEnabled: !!user.isTwoFactorAuthEnabled,
      isTwoFactorAuthenticated: true,
    };

    this.setJwtCookie(res, user, payload);
    if (redirect) {
      this.signInRedirect(res, user);
    }
  }

  async setJwtCookie(
    @Res() res: Response,
    user: any,
    payload: object,
  ): Promise<void> {
    const access_token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', access_token, {
      maxAge: this.configService.get<number>('JWT_EXPIRATION_TIME') * 60 * 1000, // minutes to milliseconds
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      path: '/',
    });
  }

  async signInRedirect(@Res() res: Response, user: any): Promise<void> {
    if (user.isTwoFactorAuthEnabled && !user.isTwoFactorAuthenticated) {
      res.redirect(
        `${this.configService.get<string>(
          'APP_DOMAIN',
        )}/callback?requires2FA=true`,
      );
    } else {
      res.redirect(
        `${this.configService.get<string>('APP_DOMAIN')}/callback${
          user.new ? '?new=true' : ''
        }`,
      );
    }
  }

  async verify(token: string): Promise<UserEntity> {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.jwt2faStrategy.validate(payload);
      return user;
    } catch (error) {
      throw new UnauthorizedException({ message: error });
    }
  }

  async generate2faCode(user: UserEntity): Promise<GeneratedTwoFactorAuth> {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.name,
      this.configService.get<string>('APP_NAME'),
      secret,
    );

    await this.userService.update(user.id, {
      twoFactorAuthSecret: secret,
    });

    const qrCode = await toDataURL(otpAuthUrl);
    const manualEntryKey = `${this.configService.get<string>('APP_NAME')}:${
      user.name
    }:${secret}`;

    return { qrCode, manualEntryKey };
  }

  generateQrCodeDataUrl(otpAuthUrl: string): Promise<string> {
    return toDataURL(otpAuthUrl);
  }

  verify2faCode(user: UserEntity, code: string) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthSecret,
    });
  }
}
