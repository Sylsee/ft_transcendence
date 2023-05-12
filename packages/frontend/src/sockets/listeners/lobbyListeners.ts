import { Dispatch } from "@reduxjs/toolkit";
import { ChatEvent } from "config";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { getChatSocket, getGameSocket } from "sockets/socket";
import { setLobby, setLobbyStatus } from "store/game-slice/game-slice";
import {
	LobbyData,
	LobbyReceiveEvent,
	LobbyState,
	LOBBY_RECEIVE_EVENT_BASE_URL,
} from "types/game/lobby";

export const socketLobbyListeners = (dispatch: Dispatch) => {
	const socket = getGameSocket();
	if (!socket) return;

	console.log("socketLobbyListeners");

	socket.on(
		`${LOBBY_RECEIVE_EVENT_BASE_URL}${LobbyReceiveEvent.State}`,
		(data: LobbyData) => {
			console.log(LobbyReceiveEvent.State, data);
			dispatch(setLobbyStatus(LobbyState.Found));
			dispatch(setLobby(data));
		}
	);

	socket.on(ChatEvent.Exception, (data: any) => {
		toast.error(data.message);
	});
};

export const removeSocketLobbyListeners = () => {
	const socket: Socket | undefined = getChatSocket();
	if (!socket) return;

	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${LobbyReceiveEvent.State}`);
	socket.off(ChatEvent.Exception);
};
