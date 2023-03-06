import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OauthAuthGuard extends AuthGuard('oauth') {}
