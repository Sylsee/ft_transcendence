// NestJS imports
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth42Guard extends AuthGuard('42') {}
