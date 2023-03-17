import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { lastValueFrom } from 'rxjs';

import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

const callbackURL = 'http://localhost:3000/auth/login';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth2') {
  private readonly logger = new Logger(OAuthStrategy.name);

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: configService.get<string>('API_42_UID'),
        redirect_uri: callbackURL,
        response_type: 'code',
        scope: 'public',
      })}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get<string>('API_42_UID'),
      clientSecret: configService.get<string>('API_42_SECRET'),
      callbackURL: callbackURL,
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string): Promise<any> {
    this.logger.debug('Validate OAuth token');

    const data = await lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
    if (!data) {
      this.logger.warn("Failed to fetch user data via 42's API");
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateOAuthUser(
      accessToken,
      refreshToken,
      data.data,
    );
    if (!user) {
      this.logger.warn(
        `Failed to validate OAuth user with ID: ${data.data.id}`,
      );
      throw new UnauthorizedException();
    }
    this.logger.log(`OAuth user with ID: ${user.id} validated`);
    return user;
  }
}
