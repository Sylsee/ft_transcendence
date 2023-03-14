import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';

import { AuthService } from '../auth.service';

const callbackURL = 'http://localhost:3000/auth/42';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth2') {
  private readonly logger = new Logger(OAuthStrategy.name);

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: process.env.FT_CLIENT_ID,
        redirect_uri: callbackURL,
        response_type: 'code',
        scope: 'public',
      })}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: callbackURL,
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string): Promise<any> {
    this.logger.debug('Validate OAuth');

    const data = await lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
    if (!data) {
      this.logger.error("Failed to fetch user data via 42's API", data.data.id);
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateOAuthUser(
      accessToken,
      refreshToken,
      data.data,
    );
    if (!user) {
      this.logger.error('Failed to validate OAuth user', data.data.id);
      throw new UnauthorizedException();
    }
    this.logger.debug('OAuth user validated', data.data.id);
    return user;
  }
}
