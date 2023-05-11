import { io, Socket } from "socket.io-client";

let chatSocket: Socket | undefined;

export const initializeChatSocket = (): Socket => {
	if (!chatSocket) {
		chatSocket = io("http://localhost:3000/chat", {
			withCredentials: true,
			autoConnect: false,
		});
	}
	return chatSocket;
};

export const connectChatSocket = () => {
	if (chatSocket && !chatSocket.connected) {
		chatSocket.connect();
	}
};

export const disconnectChatSocket = () => {
	if (chatSocket && chatSocket.connected) {
		chatSocket.disconnect();
	}
};

export const getChatSocket = (): Socket | undefined => chatSocket;

export const emitChatSocketEvent = (event: string, payload: any): void => {
	const chatSocket = getChatSocket();
	if (chatSocket) {
		chatSocket.emit(`send:${event}`, payload);
	}
};

let gameSocket: Socket | undefined;

export const connectGameSocket = (): Socket => {
	if (!gameSocket) {
		gameSocket = io("http://localhost:3000/game", {
			withCredentials: true,
		});
	}
	return gameSocket;
};

export const getGameSocket = (): Socket | undefined => gameSocket;

export const emitGameSocketEvent = (event: string, payload: any): void => {
	const gameSocket = getGameSocket();
	if (gameSocket) {
		gameSocket.emit(`send:${event}`, payload);
	}
};
