// Third-party imports
import { Server } from 'socket.io';

// Local imports
import { ChatEvent } from 'src/chat/enum/chat-event.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

export async function sendEvent(
  server: Server,
  user: string | UserEntity | Array<string | UserEntity>,
  event: ChatEvent,
  data: object | string,
  userService: UserService,
): Promise<void> {
  const socketIds: string[] = [];

  const getSocketId = async (
    user: string | UserEntity,
  ): Promise<string | null> => {
    if (typeof user === 'string') {
      return user;
    } else {
      return await userService.getSocketID(user.id);
    }
  };

  if (Array.isArray(user)) {
    const promises = user.map(getSocketId);
    const ids = await Promise.all(promises);
    for (const id of ids) {
      if (id) {
        socketIds.push(id);
      }
    }
  } else {
    const socketId = await getSocketId(user);
    if (socketId) {
      socketIds.push(socketId);
    }
  }

  Promise.all(
    socketIds.map((socketId) => {
      server.to(socketId).emit(event, data);
    }),
  );
}
