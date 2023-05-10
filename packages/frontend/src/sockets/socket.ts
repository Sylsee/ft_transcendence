import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

export const connectSocket = (): Socket => {
	if (!socket) {
		socket = io("http://localhost:3000/chat", {
			withCredentials: true,
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
