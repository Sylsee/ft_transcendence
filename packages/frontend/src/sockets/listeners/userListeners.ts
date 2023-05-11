import { QueryClient } from "@tanstack/react-query";
import { UserEvent } from "config";
import { updateUserStatusFromQuery } from "hooks/userRelations/utils/queryUtils";
import { Socket } from "socket.io-client";
import { getChatSocket } from "sockets/socket";

export const socketUserListeners = (
	queryClient: QueryClient,
	connectedUserId: string
) => {
	const socket = getChatSocket();
	if (!socket) return;

	socket.on(UserEvent.Status, (data: any) => {
		console.log(UserEvent.Status, data);
		updateUserStatusFromQuery(
			queryClient,
			data.id,
			connectedUserId,
			data.status
		);
	});
};

export const removeSocketUserListeners = () => {
	const socket: Socket | undefined = getChatSocket();
	if (!socket) return;

	socket.off(UserEvent.Status);
};
