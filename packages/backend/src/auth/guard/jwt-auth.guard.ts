// NestJS imports
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger: Logger = new Logger(JwtAuthGuard.name);

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.warn('Failed to validate JWT user', info);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
