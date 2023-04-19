import { io, Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "../config";

let socket: Socket | undefined;

export const connectSocket = (token: string): Socket => {
	if (!socket) {
		socket = io(SOCKET_BASE_URL, {
			extraHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return socket;
};

export const getSocket = (): Socket | undefined => socket;

export const emitSocketEvent = (event: string, payload: any): void => {
	const socket = getSocket();
	if (socket) {
		socket.emit(`send:${event}`, payload);
	}
};
