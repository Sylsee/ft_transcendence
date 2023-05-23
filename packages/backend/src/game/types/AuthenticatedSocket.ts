// Third-party imports
import { Socket } from 'socket.io';

// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ServerGameEvents } from '../enum/server-game-event.enum';
import { Lobby } from '../lobby/lobby';

export type AuthenticatedSocket = Socket & {
  data: {
    id: UserEntity['id'];
    lobby: Lobby | null;
  };

  emit: <T>(ev: ServerGameEvents, data: T) => boolean;
};
