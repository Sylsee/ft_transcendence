import { io, Socket } from "socket.io-client";
import { removeSocketChatListeners } from "sockets/listeners/chatListeners";
import { removeSocketGameListeners } from "sockets/listeners/gameListeners";
import { removeSocketLobbyListeners } from "sockets/listeners/lobbyListeners";
import { removeSocketUserListeners } from "sockets/listeners/userListeners";
import { CHAT_EVENT_BASE_URL } from "types/chat/chat";
import { GAME_SEND_EVENT_BASE_URL } from "types/game/game";
import { LOBBY_SEND_EVENT_BASE_URL } from "types/game/lobby";

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
	return new Promise<void>((resolve, reject) => {
		if (chatSocket && !chatSocket.connected) {
			chatSocket.connect();

			chatSocket.on("connect", () => {
				resolve();
			});

			chatSocket.on("connect_error", (error: any) => {
				reject(error);
			});
		}
		resolve();
	});
};

export const disconnectChatSocket = () => {
	if (chatSocket && chatSocket.connected) {
		chatSocket.disconnect();
	}
};

export const getChatSocket = (): Socket | undefined => chatSocket;

export const emitChatSocketEvent = (event: string, payload: any): void => {
	const chatSocket = getChatSocket();
	if (chatSocket && chatSocket.connected) {
		chatSocket.emit(`${CHAT_EVENT_BASE_URL}${event}`, payload);
	}
};

let gameSocket: Socket | undefined;

export const initializeGameSocket = (): Socket => {
	if (!gameSocket) {
		gameSocket = io("http://localhost:3000/game", {
			withCredentials: true,
			autoConnect: false,
		});
	}
	return gameSocket;
};

export const connectGameSocket = () => {
	return new Promise<void>((resolve, reject) => {
		if (gameSocket && !gameSocket.connected) {
			gameSocket.connect();

			gameSocket.on("connect", () => {
				resolve();
			});

			gameSocket.on("connect_error", (error: any) => {
				reject(error);
			});
		}
		resolve();
	});
};

export const disconnectGameSocket = () => {
	if (gameSocket && gameSocket.connected) {
		gameSocket.disconnect();
	}
};

export const getGameSocket = (): Socket | undefined => gameSocket;

export const emitLobbySocketEvent = (
	event: string,
	payload: any = {}
): void => {
	const gameSocket = getGameSocket();
	if (gameSocket && gameSocket.connected) {
		gameSocket.emit(`${LOBBY_SEND_EVENT_BASE_URL}${event}`, payload);
	}
};

export const emitGameSocketEvent = (event: string, payload: any): void => {
	const gameSocket = getGameSocket();
	if (gameSocket && gameSocket.connected) {
		gameSocket.emit(`${GAME_SEND_EVENT_BASE_URL}${event}`, payload);
	}
};

export const disconnectSockets = () => {
	removeSocketChatListeners();
	removeSocketUserListeners();
	disconnectChatSocket();

	removeSocketGameListeners();
	removeSocketLobbyListeners();
	disconnectGameSocket();
};
