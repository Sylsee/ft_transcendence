// NestJS imports
import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// Third-party imports
import { performance } from 'perf_hooks';

// Local imports
import { gameConfig } from 'src/config/game.config';
import { UserDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { COUNT_DOWN_TIME } from '../constants';
import { MovePaddleDto } from '../dto/move-paddle.dto';
import { MatchEntity } from '../entity/match.entity';
import { PaddleDirection } from '../enum/paddle-direction.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Lobby } from '../lobby/lobby';
import { MatchRepository } from '../repository/match.repository';
import { AuthenticatedSocket } from '../types/AuthenticatedSocket';
import { Ball } from './types/ball';
import { Paddle } from './types/paddle';

export class Game {
  private readonly logger: Logger = new Logger(Game.name);

  public playersReady = new Map<string, boolean>();

  public hasStarted = false;
  public hasFinished = false;
  public stop = false;
  private gamePaused = false;

  public scores: Record<string, number> = {};

  private paddle1: Paddle;
  private paddle2: Paddle;
  private ball: Ball;

  private ballSpeedPerSecond = gameConfig.ballSpeedPerSecond;
  private ballDirection: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

  private match: MatchEntity;

  constructor(
    private readonly lobby: Lobby,
    private readonly matchRepository: MatchRepository,
    private readonly userService: UserService,
  ) {}

  public initializeGameObjects(): void {
    this.paddle1 = {
      x: gameConfig.paddleMargin,
      y: gameConfig.height / 2 - gameConfig.paddleHeight / 2,
      width: gameConfig.paddleWidth,
      height: gameConfig.paddleHeight,
      velocity: {
        y: 0,
      },
      direction: PaddleDirection.NONE,
    };
    this.paddle2 = {
      x: gameConfig.width - gameConfig.paddleMargin - gameConfig.paddleWidth,
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
        x: Math.cos(angle) * this.ballSpeedPerSecond * this.ballDirection,
        y: Math.sin(angle) * this.ballSpeedPerSecond,
      },
    };

    // Reverse the ball's horizontal direction for the next reset
    this.ballDirection *= -1;
    // Increase the ball's speed for the next reset
    this.ballSpeedPerSecond += gameConfig.speedUp;
  }

  public async triggerStart(): Promise<void> {
    try {
      this.initializeGameObjects();

      this.playersReady.clear();

      this.lobby.players.forEach((player) => {
        this.scores[player.id] = 0;
      });

      this.lobby.dispatchToLobby<ServerGameEvents.GameStart>(
        ServerGameEvents.GameStart,
        {
          player1: this.lobby.player1.data.id,
          player2: this.lobby.player2.data.id,
          width: gameConfig.width,
          height: gameConfig.height,
          paddleWidth: gameConfig.paddleWidth,
          paddleHeight: gameConfig.paddleHeight,
          paddleSpeedPerSecond: gameConfig.paddleSpeedPerSecond,
          paddleCoordinates: {
            paddle1: {
              x: this.paddle1.x,
              y: this.paddle1.y,
            },
            paddle2: {
              x: this.paddle2.x,
              y: this.paddle2.y,
            },
          },
          ballRadius: gameConfig.ballRadius,
          ballCoordinates: {
            x: this.ball.x,
            y: this.ball.y,
          },
          timeStep: gameConfig.timeStep,
          maxScore: gameConfig.maxScore,
        },
      );

      await this.countDown(COUNT_DOWN_TIME);

      if (this.stop) {
        return;
      }

      this.hasStarted = true;

      this.roundManager();
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  public triggerFinish(): void {
    this.hasFinished = true;

    const winner = this.match?.winner
      ? UserDto.transform(this.match.winner)
      : null;

    this.lobby.dispatchToLobby<ServerGameEvents.GameFinish>(
      ServerGameEvents.GameFinish,
      {
        winner: winner,
        player1Score: this.scores[this.lobby.player1?.id],
        player2Score: this.scores[this.lobby.player2?.id],
      },
    );
  }

  public async setLoser(playerId?: UserEntity['id']): Promise<UserEntity> {
    const player1 = await this.getUserById(this.lobby.player1?.data.id);
    const player2 = await this.getUserById(this.lobby.player2?.data.id);

    const player1Score = this.scores[this.lobby.player1?.id];
    const player2Score = this.scores[this.lobby.player2?.id];

    const winner = playerId
      ? playerId === player1.id
        ? player2
        : player1
      : null;

    this.match = await this.matchRepository.create(
      this.lobby.mode,
      player1,
      player2,
      player1Score,
      player2Score,
      winner,
    );

    return playerId ? (playerId === player1.id ? player1 : player2) : null;
  }

  public movePaddle(
    client: AuthenticatedSocket,
    movePaddleDto: MovePaddleDto,
  ): void {
    const paddle = this.getPaddle(client.id);
    paddle.direction = movePaddleDto.direction;
  }

  private roundManager(): void {
    let accumulator = 0;
    let previousTime = performance.now();

    const gameLoop = async () => {
      if (this.hasFinished || this.stop) {
        return;
      }

      const currentTime = performance.now();
      const elapsedTime = (currentTime - previousTime) / 1000; // Time elapsed in seconds
      previousTime = currentTime;

      accumulator += elapsedTime;

      while (accumulator >= gameConfig.timeStep) {
        await this.updateGameState(gameConfig.timeStep);

        if (this.gamePaused) {
          await this.countDown(gameConfig.pointCountDownDuration);
          this.gamePaused = false;
          previousTime = performance.now();
        }

        if (this.hasFinished) {
          this.triggerFinish();
          return;
        }

        this.sendGameState();
        accumulator -= gameConfig.timeStep;
      }

      if (this.hasFinished === false && this.stop === false) {
        setImmediate(gameLoop);
      }
    };

    setImmediate(gameLoop);
  }

  private async updateGameState(timeStep: number): Promise<void> {
    this.updatePaddlePosition(timeStep);
    this.updateBallPosition(timeStep);
    await this.handleCollisions();
  }

  private updatePaddlePosition(timeStep: number): void {
    if (this.paddle1.direction === PaddleDirection.UP) {
      this.paddle1.y -= gameConfig.paddleSpeedPerSecond * timeStep;
    } else if (this.paddle1.direction === PaddleDirection.DOWN) {
      this.paddle1.y += gameConfig.paddleSpeedPerSecond * timeStep;
    }
    this.checkPaddleBounds(this.paddle1);

    if (this.paddle2.direction === PaddleDirection.UP) {
      this.paddle2.y -= gameConfig.paddleSpeedPerSecond * timeStep;
    } else if (this.paddle2.direction === PaddleDirection.DOWN) {
      this.paddle2.y += gameConfig.paddleSpeedPerSecond * timeStep;
    }
    this.checkPaddleBounds(this.paddle2);
  }

  private checkPaddleBounds(paddle: Paddle): void {
    if (paddle.y <= gameConfig.paddleMargin) {
      paddle.y = gameConfig.paddleMargin;
    } else if (
      paddle.y >=
      gameConfig.height - paddle.height - gameConfig.paddleMargin
    ) {
      paddle.y = gameConfig.height - paddle.height - gameConfig.paddleMargin;
    }
  }

  private updateBallPosition(timeStep: number): void {
    this.ball.x += this.ball.velocity.x * timeStep;
    this.ball.y += this.ball.velocity.y * timeStep;
  }

  private async handleCollisions(): Promise<void> {
    if (this.ballCollidesWithPaddle(this.paddle1)) {
      this.handlePaddleCollision(this.paddle1);
    } else if (this.ballCollidesWithPaddle(this.paddle2)) {
      this.handlePaddleCollision(this.paddle2);
    }

    if (this.ball.y <= 0 || this.ball.y >= gameConfig.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
    } else if (this.ball.x <= 0 || this.ball.x >= gameConfig.width) {
      await this.handleScreenBoundsCollision();
    }
  }

  private handlePaddleCollision(paddle: Paddle): void {
    const normalizedIntersectionY =
      (this.ball.y - (paddle.y + paddle.height / 2)) / paddle.height / 2;

    this.ball.velocity.x = -this.ball.velocity.x;
    this.ball.velocity.y = normalizedIntersectionY * this.ballSpeedPerSecond;
  }

  private async handleScreenBoundsCollision(): Promise<void> {
    // Update scores, reinitialize game objects, and dispatch score
    if (this.ball.x <= 0) {
      this.scores[this.lobby.player1.id]++;
    } else {
      this.scores[this.lobby.player2.id]++;
    }

    this.initializeGameObjects();
    this.dispatchScore();

    await this.checkGameFinish();
    if (this.hasFinished) {
      return;
    }

    this.gamePaused = true;
  }

  private sendGameState(): void {
    this.lobby.dispatchToLobby<ServerGameEvents.GameState>(
      ServerGameEvents.GameState,
      {
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
      },
    );
  }

  private ballCollidesWithPaddle(paddle: Paddle): boolean {
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

  private dispatchScore(): void {
    this.lobby.dispatchToLobby<ServerGameEvents.GameScore>(
      ServerGameEvents.GameScore,
      {
        player1Score: this.scores[this.lobby.player1?.id],
        player2Score: this.scores[this.lobby.player2?.id],
      },
    );
  }

  private async checkGameFinish(): Promise<void> {
    if (this.scores[this.lobby.player1.id] === gameConfig.maxScore) {
      this.hasFinished = true;
      await this.setLoser(this.lobby.player2.id);
    } else if (this.scores[this.lobby.player2.id] === gameConfig.maxScore) {
      this.hasFinished = true;
      await this.setLoser(this.lobby.player1.id);
    }
  }

  private getPaddle(playerId: string): Paddle {
    if (playerId === this.lobby.player1.id) {
      return this.paddle1;
    } else if (playerId === this.lobby.player2.id) {
      return this.paddle2;
    }

    this.logger.error(`Paddle not found for player with id: ${playerId}`);
    throw new WsException(`Paddle not found`);
  }

  private async getUserById(id: UserEntity['id']): Promise<UserEntity> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      this.logger.error(`User not found with id: ${id}`);
      throw new WsException(`User not found`);
    }
    return user;
  }

  private countDown(seconds: number, sendEach = 1000): Promise<void> {
    return new Promise((resolve) => {
      let remainingSeconds = seconds - 1;

      this.lobby.players.forEach((player) => {
        player.emit(ServerGameEvents.GameCountdown, {
          seconds: seconds,
        });
      });

      const countdownInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
          this.lobby.players.forEach((player) => {
            player.emit(ServerGameEvents.GameCountdown, {
              seconds: 0,
            });
          });

          clearInterval(countdownInterval);
          resolve();
        } else {
          if (this.stop) {
            clearInterval(countdownInterval);
            resolve();
          }

          this.lobby.players.forEach((player) => {
            player.emit(ServerGameEvents.GameCountdown, {
              seconds: remainingSeconds,
            });
          });

          remainingSeconds--;
        }
      }, sendEach);
    });
  }
}
