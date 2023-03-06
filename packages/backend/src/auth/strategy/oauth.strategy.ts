import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../auth.service';

const callbackURL = 'http://localhost:3000/auth/42';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: process.env.FT_CLIENT_ID,
        redirect_uri: callbackURL,
        scope: 'public',
        response_type: 'code',
      })}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.FT_CLIENT_ID;
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: callbackURL,
      scope: 'public',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log('validate', accessToken);
    const user = await this.authService.validateOAuthUser(
      accessToken,
      refreshToken,
      profile,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;

    // const data = await this.http
    // .get('https://api.intra.42.fr/v2/me', {
    // headers: { Authorization: `Bearer ${accessToken}` },
    // })
    // .toPromise();
    // const jwt = await this.jwtService.signAsync({ id: data.data.id });

    // return jwt;
  }
}
