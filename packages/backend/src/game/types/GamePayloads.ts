// Local imports
import { UserDto } from 'src/user/dto/user.dto';
import { UserWithReadyStatusDto } from '../dto/user-with-ready-status.dto';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Ball } from '../game/types/ball';
import { Paddle } from '../game/types/paddle';

export type GamePayloads = {
  [ServerGameEvents.LobbyState]: {
    lobbyId: string;
    players: UserWithReadyStatusDto[];
    hasStarted: boolean;
    hasFinished: boolean;
    currentRound: number;
    player1Score: number;
    player2Score: number;
  };

  [ServerGameEvents.GameMessage]: {
    message: string;
  };

  [ServerGameEvents.GameStart];

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
};
