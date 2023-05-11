// NestJS imports
import { Logger } from '@nestjs/common';

// Local imports
import { Lobby } from '../lobby/lobby';

export class Instance {
  private readonly logger: Logger = new Logger(Instance.name);

  public playersReady = new Map<string, boolean>();
  public hasStarted = false;
  public hasFinished = false;
  public currentRound = 1;
  public scores: Record<string, number> = {};

  constructor(private readonly lobby: Lobby) {
    this.initialize();
  }

  public initialize(): void {
    this.logger.debug('Initializing game instance');
    return;
  }

  public triggerStart(): void {
    this.logger.debug('Triggering game start');
    return;
  }

  public triggerFinish(): void {
    this.logger.debug('Triggering game finish');
    return;
  }
}
