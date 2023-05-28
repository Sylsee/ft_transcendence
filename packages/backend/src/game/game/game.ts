// NestJS imports
import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

// Third-party imports
import { performance } from 'perf_hooks';
import { v4 } from 'uuid';

// Local imports
import { gameConfig } from 'src/config/game.config';
import { UserDto } from 'src/user/dto/user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { COUNT_DOWN_TIME } from '../constants';
import { MovePaddleDto } from '../dto/move-paddle.dto';
import { MatchEntity } from '../entity/match.entity';
import { PaddleDirection } from '../enum/paddle-direction.enum';
import { PowerUpType } from '../enum/power-up-type.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Lobby } from '../lobby/lobby';
import { MatchRepository } from '../repository/match.repository';
import { AuthenticatedSocket } from '../types/AuthenticatedSocket';
import { Ball } from './types/ball';
import { Paddle } from './types/paddle';
import { PowerUp } from './types/power-up';

export class Game {
  private readonly logger: Logger = new Logger(Game.name);

  public playersReady = new Map<string, boolean>();

  public hasStarted = false;
  public hasFinished = false;
  public stop = false;
  private gamePaused = false;

  public scores: Record<UserEntity['id'], number> = {};

  private paddle1: Paddle;
  private paddle1SizeTimeout: NodeJS.Timeout | null = null;
  private paddle2: Paddle;
  private paddle2SizeTimeout: NodeJS.Timeout | null = null;
  private ball: Ball;
  private ballSizeTimeout: NodeJS.Timeout | null = null;

  private powerUps: Array<PowerUp> = [];

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
    // Reset the ball's speed
    this.ballSpeedPerSecond = gameConfig.ballSpeedPerSecond;

    this.ball = {
      x: gameConfig.width / 2,
      y: gameConfig.height / 2,
      radius: gameConfig.ballRadius,
      velocity: {
        x: Math.cos(angle) * this.ballSpeedPerSecond * this.ballDirection,
        y: Math.sin(angle) * this.ballSpeedPerSecond,
      },
    };

    // Reverse the ball's horizontal direction for the next reset
    this.ballDirection *= -1;

    if (this.paddle1SizeTimeout) {
      clearTimeout(this.paddle1SizeTimeout);
      this.paddle1SizeTimeout = null;
    }
    if (this.paddle2SizeTimeout) {
      clearTimeout(this.paddle2SizeTimeout);
      this.paddle2SizeTimeout = null;
    }
    if (this.ballSizeTimeout) {
      clearTimeout(this.ballSizeTimeout);
      this.ballSizeTimeout = null;
    }

    this.powerUps.forEach((powerUp) => {
      this.lobby.dispatchToLobby<ServerGameEvents.GamePowerUpDespawn>(
        ServerGameEvents.GamePowerUpDespawn,
        {
          id: powerUp.id,
        },
      );
    });
    this.powerUps = [];
  }

  public async triggerStart(): Promise<void> {
    try {
      this.initializeGameObjects();

      this.playersReady.clear();

      this.lobby.players.forEach((player) => {
        this.scores[player.data.id] = 0;
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
        player1Score: this.scores[this.lobby.player1?.data.id],
        player2Score: this.scores[this.lobby.player2?.data.id],
      },
    );
  }

  public async setLoser(playerId: UserEntity['id']): Promise<UserEntity> {
    const winner = await this.getUserById(
      playerId === this.lobby.player1?.data.id
        ? this.lobby.player2?.data.id
        : this.lobby.player1?.data.id,
    );
    const loser = await this.getUserById(playerId);

    this.match = await this.matchRepository.create(
      this.lobby.mode,
      winner,
      loser,
      this.scores[winner.id],
      this.scores[loser.id],
    );

    return loser;
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
    if (
      this.lobby.powerUpActive === true &&
      Math.random() < gameConfig.powerUpSpawnChance
    ) {
      this.spawnPowerUp();
    }

    this.updatePaddlePosition(timeStep);
    this.updateBallPosition(timeStep);
    await this.handleCollisions();
  }

  private spawnPowerUp(): void {
    let powerUpX =
      Math.random() * (gameConfig.width - gameConfig.powerUpRadius);
    if (powerUpX < gameConfig.paddleMargin * 2 + gameConfig.powerUpRadius) {
      powerUpX = gameConfig.paddleMargin * 2 + gameConfig.powerUpRadius;
    } else if (
      powerUpX >
      gameConfig.width - gameConfig.paddleMargin * 2 - gameConfig.powerUpRadius
    ) {
      powerUpX = gameConfig.paddleMargin * 2 + gameConfig.powerUpRadius;
    }

    let powerUpY =
      Math.random() * (gameConfig.height - gameConfig.powerUpRadius);
    if (powerUpY < gameConfig.paddleMargin * 2 + gameConfig.powerUpRadius) {
      powerUpY = gameConfig.paddleMargin * 2 + gameConfig.powerUpRadius;
    } else if (
      powerUpY >
      gameConfig.height - gameConfig.paddleMargin * 2 - gameConfig.powerUpRadius
    ) {
      powerUpY = gameConfig.paddleMargin * 2 + gameConfig.powerUpRadius;
    }

    const enumValues = Object.values(PowerUpType);
    const randomIndex = Math.floor(Math.random() * enumValues.length);

    const newPowerUp: PowerUp = {
      id: v4(),
      type: enumValues[randomIndex],
      x: powerUpX,
      y: powerUpY,
      radius: gameConfig.powerUpRadius,
    };

    this.powerUps.push(newPowerUp);

    this.lobby.dispatchToLobby<ServerGameEvents.GamePowerUpSpawn>(
      ServerGameEvents.GamePowerUpSpawn,
      {
        id: newPowerUp.id,
        type: newPowerUp.type,
        x: newPowerUp.x,
        y: newPowerUp.y,
        radius: newPowerUp.radius,
      },
    );
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
    if (paddle.y < gameConfig.paddleMargin) {
      paddle.y = gameConfig.paddleMargin;
    } else if (
      paddle.y >
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
    // prettier-ignore
    if (
      this.ball.velocity.x < 0 &&
      this.ballCollidesWithPaddle(this.paddle1)
    ) {
      this.handleBallPaddleCollision(this.paddle1);
    } else if (
      this.ball.velocity.x > 0 &&
      this.ballCollidesWithPaddle(this.paddle2)
    ) {
      this.handleBallPaddleCollision(this.paddle2);
    }

    if (
      this.ball.y <= this.ball.radius ||
      this.ball.y >= gameConfig.height - this.ball.radius
    ) {
      this.ball.velocity.y = -this.ball.velocity.y;
    } else if (
      this.ball.x <= this.ball.radius ||
      this.ball.x >= gameConfig.width - this.ball.radius
    ) {
      await this.handleScreenBoundsCollision();
    }

    if (this.powerUps.length > 0) {
      this.handlePowerUpCollisions();
    }
  }

  private handlePowerUpCollisions(): void {
    this.powerUps.forEach((powerUp) => {
      const distX = this.ball.x - powerUp.x;
      const distY = this.ball.y - powerUp.y;

      const distanceBetweenCenters = Math.sqrt(distX ** 2 + distY ** 2);

      if (distanceBetweenCenters <= this.ball.radius + powerUp.radius) {
        this.handlePowerUpCollision(powerUp);
        this.powerUps.splice(this.powerUps.indexOf(powerUp), 1);
      }
    });
  }

  private powerUpHandler = {
    [PowerUpType.BALL_SIZE_DOWN]: () => {
      this.ball.radius -= gameConfig.ballRadiusChangePerPowerUp;
      if (this.ball.radius < gameConfig.ballMinRadius) {
        this.ball.radius = gameConfig.ballMinRadius;
      }

      this.revertBallSizeAfterDelay();
    },
    [PowerUpType.BALL_SIZE_UP]: () => {
      this.ball.radius += gameConfig.ballRadiusChangePerPowerUp;
      if (this.ball.radius > gameConfig.ballMaxRadius) {
        this.ball.radius = gameConfig.ballMaxRadius;
      }

      this.revertBallSizeAfterDelay();
    },
    [PowerUpType.PADDLE_SIZE_DOWN]: () => {
      if (this.ball.velocity.x < 0) {
        this.paddle1.height -= gameConfig.paddleHeightChangePerPowerUp;
        if (this.paddle1.height < gameConfig.paddleMinHeight) {
          this.paddle1.height = gameConfig.paddleMinHeight;
        }

        this.paddle1.y += gameConfig.paddleHeightChangePerPowerUp / 2;
        this.checkPaddleBounds(this.paddle1);

        this.revertPaddleSizeAfterDelay(this.paddle1);
      } else {
        this.paddle2.height -= gameConfig.paddleHeightChangePerPowerUp;
        if (this.paddle2.height < gameConfig.paddleMinHeight) {
          this.paddle2.height = gameConfig.paddleMinHeight;
        }

        this.paddle2.y += gameConfig.paddleHeightChangePerPowerUp / 2;
        this.checkPaddleBounds(this.paddle2);

        this.revertPaddleSizeAfterDelay(this.paddle2);
      }
    },
    [PowerUpType.PADDLE_SIZE_UP]: () => {
      if (this.ball.velocity.x > 0) {
        this.paddle1.height += gameConfig.paddleHeightChangePerPowerUp;
        if (this.paddle1.height > gameConfig.paddleMaxHeight) {
          this.paddle1.height = gameConfig.paddleMaxHeight;
        }

        this.paddle1.y -= gameConfig.paddleHeightChangePerPowerUp / 2;
        this.checkPaddleBounds(this.paddle1);

        this.revertPaddleSizeAfterDelay(this.paddle1);
      } else {
        this.paddle2.height += gameConfig.paddleHeightChangePerPowerUp;
        if (this.paddle2.height > gameConfig.paddleMaxHeight) {
          this.paddle2.height = gameConfig.paddleMaxHeight;
        }

        this.paddle2.y -= gameConfig.paddleHeightChangePerPowerUp / 2;
        this.checkPaddleBounds(this.paddle2);

        this.revertPaddleSizeAfterDelay(this.paddle2);
      }
    },
  };

  private handlePowerUpCollision(powerUp: PowerUp): void {
    const handler = this.powerUpHandler[powerUp.type];
    if (handler) {
      handler();
    }

    this.lobby.dispatchToLobby<ServerGameEvents.GamePowerUpDespawn>(
      ServerGameEvents.GamePowerUpDespawn,
      {
        id: powerUp.id,
      },
    );
  }

  private async revertPaddleSizeAfterDelay(paddle: Paddle) {
    if (paddle === this.paddle1 && this.paddle1SizeTimeout) {
      clearTimeout(this.paddle1SizeTimeout);
      this.paddle1SizeTimeout = null;
    } else if (paddle === this.paddle2 && this.paddle2SizeTimeout) {
      clearTimeout(this.paddle2SizeTimeout);
      this.paddle2SizeTimeout = null;
    }

    const timeout = setTimeout(() => {
      const heightDiff = paddle.height - gameConfig.paddleHeight;
      paddle.y += heightDiff / 2;
      this.checkPaddleBounds(paddle);

      paddle.height = gameConfig.paddleHeight;
    }, gameConfig.powerUpDuration * 1000);

    if (paddle === this.paddle1) {
      this.paddle1SizeTimeout = timeout;
    } else if (paddle === this.paddle2) {
      this.paddle2SizeTimeout = timeout;
    }
  }

  private async revertBallSizeAfterDelay() {
    if (this.ballSizeTimeout) {
      clearTimeout(this.ballSizeTimeout);
      this.ballSizeTimeout = null;
    }

    const timeout = setTimeout(() => {
      this.ball.radius = gameConfig.ballRadius;
    }, gameConfig.powerUpDuration * 1000);

    this.ballSizeTimeout = timeout;
  }

  private ballCollidesWithPaddle(paddle: Paddle): boolean {
    const halfPaddleWidth = paddle.width / 2;
    const halfPaddleHeight = paddle.height / 2;
    const ballRadius_sq = this.ball.radius * this.ball.radius;

    const distX = this.ball.x - (paddle.x + halfPaddleWidth);
    const distY = this.ball.y - (paddle.y + halfPaddleHeight);

    const distX_sq = distX * distX;
    const distY_sq = distY * distY;

    const distWidthRadius = halfPaddleWidth + this.ball.radius;
    const distHeightRadius = halfPaddleHeight + this.ball.radius;

    if (
      distX_sq > distWidthRadius * distWidthRadius ||
      distY_sq > distHeightRadius * distHeightRadius
    ) {
      return false;
    }

    if (
      distX_sq <= halfPaddleWidth * halfPaddleWidth ||
      distY_sq <= halfPaddleHeight * halfPaddleHeight
    ) {
      return true;
    }

    const cornerDistance_sq =
      distX_sq +
      distY_sq -
      halfPaddleWidth * halfPaddleWidth -
      halfPaddleHeight * halfPaddleHeight;

    return cornerDistance_sq <= ballRadius_sq;
  }

  private handleBallPaddleCollision(paddle: Paddle): void {
    const paddleMiddle = paddle.y + paddle.height / 2;
    const normalizedIntersectionY =
      (this.ball.y - paddleMiddle) / (paddle.height / 2);
    const bounceAngle = normalizedIntersectionY * gameConfig.maxBounceAngle;

    if (this.ball.velocity.x < 0) {
      this.ball.velocity.x = Math.cos(bounceAngle) * this.ballSpeedPerSecond;
    } else {
      this.ball.velocity.x = -Math.cos(bounceAngle) * this.ballSpeedPerSecond;
    }
    this.ball.velocity.y = Math.sin(bounceAngle) * this.ballSpeedPerSecond;

    this.ballSpeedPerSecond = Math.min(
      gameConfig.ballMaxSpeed,
      this.ballSpeedPerSecond + gameConfig.ballSpeedIncreasePerBounce,
    );
  }

  private async handleScreenBoundsCollision(): Promise<void> {
    // Update scores, reinitialize game objects, and dispatch score
    if (this.ball.x <= this.ball.radius) {
      this.scores[this.lobby.player2.data.id]++;
    } else {
      this.scores[this.lobby.player1.data.id]++;
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

  private dispatchScore(): void {
    this.lobby.dispatchToLobby<ServerGameEvents.GameScore>(
      ServerGameEvents.GameScore,
      {
        player1Score: this.scores[this.lobby.player1?.data.id],
        player2Score: this.scores[this.lobby.player2?.data.id],
      },
    );
  }

  private async checkGameFinish(): Promise<void> {
    if (this.scores[this.lobby.player1.data.id] === gameConfig.maxScore) {
      this.hasFinished = true;
      await this.setLoser(this.lobby.player2.data.id);
    } else if (
      this.scores[this.lobby.player2.data.id] === gameConfig.maxScore
    ) {
      this.hasFinished = true;
      await this.setLoser(this.lobby.player1.data.id);
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
