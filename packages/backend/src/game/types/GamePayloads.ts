// Local imports
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
    scores: Record<string, number>;
  };

  [ServerGameEvents.GameMessage]: {
    message: string;
  };

  [ServerGameEvents.GameStart];

  [ServerGameEvents.GameFinish]: {
    message?: string;
    scores: Record<string, number>;
  };

  [ServerGameEvents.GameState]: {
    paddle1: Pick<Paddle, 'x' | 'y' | 'width' | 'height' | 'velocity'>;
    paddle2: Pick<Paddle, 'x' | 'y' | 'width' | 'height' | 'velocity'>;
    ball: Ball;
  };

  [ServerGameEvents.GameCountdown]: {
    seconds: number;
  };
};
