// NestJS imports
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {
  private readonly logger: Logger = new Logger(Jwt2faAuthGuard.name);

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.warn('Failed to validate JWT user', info);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
