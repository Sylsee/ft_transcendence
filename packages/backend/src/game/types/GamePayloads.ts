// Local imports
import { UserWithReadyStatusDto } from '../dto/user-with-ready-status.dto';
import { ServerGameEvents } from '../enum/server-game-event.enum';

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
};
