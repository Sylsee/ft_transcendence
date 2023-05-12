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
  public currentRound = 1;
  public scores: Record<string, number> = {};

  private paddle1: Paddle;
  private paddle2: Paddle;
  private ball: Ball;

  private ballDirection: 1 | -1 = Math.random() > 0.5 ? 1 : -1;

  private match: MatchEntity;

  constructor(
    private readonly lobby: Lobby,
    private readonly matchRepository: MatchRepository,
    private readonly userService: UserService,
  ) {}

  public async triggerStart(): Promise<void> {
    try {
      await this.initializeMatch();
      this.initializeGameObjects();

      this.playersReady.clear();

      this.lobby.players.forEach((player) => {
        this.scores[player.id] = 0;
      });

      await this.countDown(3);

      this.hasStarted = true;
      this.lobby.dispatchToLobby<ServerGameEvents.GameStart>(
        ServerGameEvents.GameStart,
        {},
      );

      this.roundManager();
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  public triggerFinish(): void {
    this.hasFinished = true;
    this.lobby.dispatchToLobby<ServerGameEvents.GameFinish>(
      ServerGameEvents.GameFinish,
      {
        winner: UserDto.transform(this.match.winner),
        player1Score: this.scores[this.lobby.player1?.id],
        player2Score: this.scores[this.lobby.player2?.id],
      },
    );
  }

  public async setLoser(playerId: UserEntity['id']): Promise<void> {
    const player = Array.from(this.lobby.players.values()).find(
      (player) => player.data.id !== playerId,
    );
    if (!player) {
      this.logger.error("Canno't set loser, player not found");
      throw new WsException('Internal server error');
    }

    const winner = await this.userService.findOneById(player.data.id);
    if (!winner) {
      this.logger.error('Winner not found after authentication');
      throw new WsException('Internal server error');
    }

    this.matchRepository.update(this.match.id, { winner: winner });
  }

  public async initializeMatch(): Promise<void> {
    const player1 = await this.userService.findOneById(
      this.lobby.player1?.data.id,
    );
    if (!player1) {
      this.logger.error('Player 1 not found after authentication');
      throw new WsException('Internal server error');
    }

    const player2 = await this.userService.findOneById(
      this.lobby.player2?.data.id,
    );
    if (!player2) {
      this.logger.error('Player 2 not found after authentication');
      throw new WsException('Internal server error');
    }

    this.match = await this.matchRepository.create(player1, player2);
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

  private roundManager(): void {
    let accumulator = 0;
    let previousTime = performance.now();

    const gameLoop = () => {
      if (this.hasFinished) {
        return;
      }

      const currentTime = performance.now();
      const elapsedTime = (currentTime - previousTime) / 1000; // Time elapsed in seconds
      previousTime = currentTime;

      accumulator += elapsedTime;

      while (accumulator >= gameConfig.timeStep) {
        this.updateGameState(gameConfig.timeStep);
        this.sendGameState();
        accumulator -= gameConfig.timeStep;
      }

      setImmediate(gameLoop);
    };

    setImmediate(gameLoop);
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

  private updateGameState(timeStep: number): void {
    // Update paddle positions
    if (this.paddle1.direction === PaddleDirection.UP) {
      this.paddle1.y -= gameConfig.paddleSpeedPerSecond * timeStep;
    } else if (this.paddle1.direction === PaddleDirection.DOWN) {
      this.paddle1.y += gameConfig.paddleSpeedPerSecond * timeStep;
    }

    if (this.paddle2.direction === PaddleDirection.UP) {
      this.paddle2.y -= gameConfig.paddleSpeedPerSecond * timeStep;
    } else if (this.paddle2.direction === PaddleDirection.DOWN) {
      this.paddle2.y += gameConfig.paddleSpeedPerSecond * timeStep;
    }

    // Update ball position
    this.ball.x += this.ball.velocity.x * timeStep;
    this.ball.y += this.ball.velocity.y * timeStep;

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
      const score = ++this.scores[this.lobby.player1.id];
      this.matchRepository.update(this.match.id, { player1Score: score });

      this.initializeGameObjects();

      this.dispatchScore();
      this.sendGameState();
    } else if (this.ball.x >= gameConfig.width) {
      const score = ++this.scores[this.lobby.player2.id];
      this.matchRepository.update(this.match.id, { player2Score: score });

      this.initializeGameObjects();

      this.dispatchScore();
      this.sendGameState();
    }
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
    if (playerId === this.lobby.player1.id) {
      return this.paddle1;
    } else if (playerId === this.lobby.player2.id) {
      return this.paddle2;
    }
  }

  private countDown(seconds: number, sendEach = 1000): Promise<void> {
    return new Promise((resolve) => {
      let remainingSeconds = seconds;

      const countdownInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
          clearInterval(countdownInterval);
          resolve();
        } else {
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
