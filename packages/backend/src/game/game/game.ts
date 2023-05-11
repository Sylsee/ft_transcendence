// NestJS imports
import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// Third-party imports
import { performance } from 'perf_hooks';

// Local imports
import { gameConfig } from 'src/config/game.config';
import { MovePaddleDto } from '../dto/move-paddle.dto';
import { PaddleDirection } from '../enum/paddle-direction.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types/AuthenticatedSocket';
import { Ball } from './types/ball';
import { Paddle } from './types/paddle';

export class Game {
  private readonly logger: Logger = new Logger(Game.name);

  public playersReady = new Map<string, boolean>();
  public hasStarted = false;
  public hasFinished = false;
  public currentRound = 1;
  public scores: Record<string, number> = {};

  private paddle1: Paddle;
  private paddle2: Paddle;
  private ball: Ball;

  private ballDirection: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

  constructor(private readonly lobby: Lobby) {
    this.initializeGameObjects();
  }

  public initializeGameObjects(): void {
    this.paddle1 = {
      x: 30,
      y: gameConfig.height / 2 - gameConfig.paddleHeight / 2,
      width: gameConfig.paddleWidth,
      height: gameConfig.paddleHeight,
      velocity: {
        y: 0,
      },
      direction: PaddleDirection.NONE,
    };
    this.paddle2 = {
      x: gameConfig.width - 30 - gameConfig.paddleWidth,
      y: gameConfig.height / 2 - gameConfig.paddleHeight / 2,
      width: gameConfig.paddleWidth,
      height: gameConfig.paddleHeight,
      velocity: {
        y: 0,
      },
      direction: PaddleDirection.NONE,
    };

    // Random angle between -22.5 and 22.5 degrees
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;

    this.ball = {
      x: gameConfig.width / 2 - gameConfig.ballRadius / 2,
      y: gameConfig.height / 2 - gameConfig.ballRadius / 2,
      radius: gameConfig.ballRadius,
      velocity: {
        x: Math.cos(angle) * gameConfig.ballSpeedPerSecond * this.ballDirection,
        y: Math.sin(angle) * gameConfig.ballSpeedPerSecond,
      },
    };

    // Reverse the ball's horizontal direction for the next reset
    this.ballDirection *= -1;
  }

  public triggerStart(): void {
    this.lobby.players.forEach((player) => {
      this.playersReady.clear();
      this.scores[player.id] = 0;
    });

    this.countDown(3);

    this.hasStarted = true;

    this.roundManager();
  }

  public triggerFinish(): void {
    this.logger.debug('Triggering game finish');
  }

  private roundManager(): void {
    let accumulator = 0;
    let previousTime = performance.now();

    const gameLoop = () => {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - previousTime) / 1000; // Time elapsed in seconds
      previousTime = currentTime;

      accumulator += elapsedTime;

      while (accumulator >= gameConfig.timeStep) {
        this.updateGameState(elapsedTime);
        this.sendGameState();
        accumulator -= gameConfig.timeStep;
      }

      setImmediate(gameLoop);
    };

    setImmediate(gameLoop);
  }

  private sendGameState(): void {
    this.lobby.dispatchToLobby(ServerGameEvents.GameState, {
      paddle1: {
        x: this.paddle1.x,
        y: this.paddle1.y,
        width: this.paddle1.width,
        height: this.paddle1.height,
        velocity: this.paddle1.velocity,
      },
      paddle2: {
        x: this.paddle2.x,
        y: this.paddle2.y,
        width: this.paddle2.width,
        height: this.paddle2.height,
        velocity: this.paddle2.velocity,
      },
      ball: this.ball,
    });
  }

  private updateGameState(elapsedTime: number): void {
    // Update paddle positions
    if (this.paddle1.direction === PaddleDirection.UP) {
      this.paddle1.y -= gameConfig.paddleSpeedPerSecond * elapsedTime;
    } else if (this.paddle1.direction === PaddleDirection.DOWN) {
      this.paddle1.y += gameConfig.paddleSpeedPerSecond * elapsedTime;
    }

    if (this.paddle2.direction === PaddleDirection.UP) {
      this.paddle2.y -= gameConfig.paddleSpeedPerSecond * elapsedTime;
    } else if (this.paddle2.direction === PaddleDirection.DOWN) {
      this.paddle2.y += gameConfig.paddleSpeedPerSecond * elapsedTime;
    }

    // Update ball position
    this.ball.x += this.ball.velocity.x * elapsedTime;
    this.ball.y += this.ball.velocity.y * elapsedTime;

    // Check ball collisions with top and bottom of the screen
    if (this.ball.y <= 0 || this.ball.y >= gameConfig.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
    }

    // Check ball collisions with paddles
    // TODO: Change the ball direction based on the paddle's angle
    if (
      this.checkPaddleBallCollision(this.paddle1) ||
      this.checkPaddleBallCollision(this.paddle2)
    ) {
      this.ball.velocity.x = -this.ball.velocity.x;
    }

    // Check ball collisions with left and right of the screen
    if (this.ball.x <= 0) {
      this.scores[this.lobby.players[0].id]++;
      this.initializeGameObjects();
    } else if (this.ball.x >= gameConfig.width) {
      this.scores[this.lobby.players[1].id]++;
      this.initializeGameObjects();
    }
  }

  private checkPaddleBallCollision(paddle: Paddle): boolean {
    const ballBounds = {
      left: this.ball.x - gameConfig.ballRadius,
      right: this.ball.x + gameConfig.ballRadius,
      top: this.ball.y - gameConfig.ballRadius,
      bottom: this.ball.y + gameConfig.ballRadius,
    };

    const paddleBounds = {
      left: paddle.x - paddle.width / 2,
      right: paddle.x + paddle.width / 2,
      top: paddle.y - paddle.height / 2,
      bottom: paddle.y + paddle.height / 2,
    };

    return (
      ballBounds.left < paddleBounds.right &&
      ballBounds.right > paddleBounds.left &&
      ballBounds.top < paddleBounds.bottom &&
      ballBounds.bottom > paddleBounds.top
    );
  }

  public movePaddle(
    client: AuthenticatedSocket,
    movePaddleDto: MovePaddleDto,
  ): void {
    const paddle = this.getPaddle(client.id);
    if (!paddle) {
      this.logger.error('Paddle not found');
      throw new WsException('Internal server error');
    }

    paddle.direction = movePaddleDto.direction;
  }

  private getPaddle(playerId: string): Paddle | void {
    if (playerId === this.lobby.players[0].id) {
      return this.paddle1;
    } else if (playerId === this.lobby.players[1].id) {
      return this.paddle2;
    }
  }

  private countDown(seconds: number, sendEach = 1000): void {
    let remainingSeconds = seconds;

    const countdownInterval = setInterval(() => {
      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        return;
      }

      this.lobby.players.forEach((player) => {
        player.emit(ServerGameEvents.GameCountdown, {
          seconds: remainingSeconds,
        });
      });

      remainingSeconds--;
    }, sendEach);
  }
}
