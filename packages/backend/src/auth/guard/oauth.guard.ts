import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuthGuard extends AuthGuard('oauth2') {
  private readonly logger = new Logger(OAuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug('TODO: OAuth Guard');

    return super.canActivate(context);
  }
}
