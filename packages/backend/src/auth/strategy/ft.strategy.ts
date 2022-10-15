import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID:
        'u-s4t2ud-190f2e21eecfa508a2ba8436c36a2dd388159bbb7192db9b9d147ee4df2f735d',
      clientSecret:
        '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',
      callbackURL: 'localhost:3000/auth/signin',
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { username, photos } = profile;
    const details = { username, photos };
    const user = await this.authService.validateUser(details);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
