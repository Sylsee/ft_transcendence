import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateOAuthUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    console.log('validateOAuthLogin', accessToken, refreshToken, profile);
    const user = await this.usersService.find(profile.id);
    if (user) {
      return user;
    }
    return this.usersService.create(profile, accessToken);
  }

  async login(req: any) {
    console.log('login', req);
    const user = this.usersService.find(req.user.id);
    if (user) {
      return user;
    }
    return this.usersService.create(req.user, req.accessToken);
    // const payload = { username: user.username, sub: user.userId };
    // return {
    // access_token: this.jwtService.signAsync(payload),
    // };
  }
}
