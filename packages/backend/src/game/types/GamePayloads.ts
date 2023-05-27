// Local imports
import { UserDto } from 'src/user/dto/user.dto';
import { UserWithReadyStatusDto } from '../dto/user-with-ready-status.dto';
import { LobbyMode } from '../enum/lobby-mode.enum';
import { PowerUpType } from '../enum/power-up-type.enum';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Ball } from '../game/types/ball';
import { Paddle } from '../game/types/paddle';

export type GamePayloads = {
  [ServerGameEvents.LobbyState]: {
    lobbyId: string;
    mode: LobbyMode;
    players: UserWithReadyStatusDto[];
    hasStarted: boolean;
    hasFinished: boolean;
  };

  [ServerGameEvents.GameMessage]: {
    message: string;
  };

  [ServerGameEvents.GameStart]: {
    player1: UserDto['id'];
    player2: UserDto['id'];
    width: number;
    height: number;
    paddleWidth: number;
    paddleHeight: number;
    paddleSpeedPerSecond: number;
    paddleCoordinates: {
      paddle1: {
        x: number;
        y: number;
      };
      paddle2: {
        x: number;
        y: number;
      };
    };
    ballRadius: number;
    ballCoordinates: {
      x: number;
      y: number;
    };
    timeStep: number;
    maxScore: number;
  };

  [ServerGameEvents.GameFinish]: {
    winner: UserDto;
    player1Score: number;
    player2Score: number;
  };

  [ServerGameEvents.GameState]: {
    paddle1: Pick<Paddle, 'x' | 'y' | 'width' | 'height' | 'velocity'>;
    paddle2: Pick<Paddle, 'x' | 'y' | 'width' | 'height' | 'velocity'>;
    ball: Ball;
  };

  [ServerGameEvents.GameCountdown]: {
    seconds: number;
  };

  [ServerGameEvents.GameScore]: {
    player1Score: number;
    player2Score: number;
  };

  [ServerGameEvents.GameIsPowerUpActive]: {
    isActive: boolean;
  };

  [ServerGameEvents.GamePowerUpSpawn]: {
    id: string;
    type: PowerUpType;
    x: number;
    y: number;
    radius: number;
  };

  [ServerGameEvents.GamePowerUpDespawn]: {
    id: string;
  };
};
