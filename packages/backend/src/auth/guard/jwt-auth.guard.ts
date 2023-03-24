// NestJs imports
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err, user, info) {
    this.logger.debug('Handle JWT request');

    if (err || !user) {
      this.logger.warn('Failed to validate JWT user', info);
      throw err || new UnauthorizedException();
    }

    this.logger.log(`JWT user with ID: ${user.id} validated`);
    return user;
  }
}
