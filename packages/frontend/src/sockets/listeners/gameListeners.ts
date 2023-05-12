import { Dispatch } from "@reduxjs/toolkit";
import { ChatEvent } from "config";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { getChatSocket, getGameSocket } from "sockets/socket";
import { GameReceiveEvent, GAME_RECEIVE_EVENT_BASE_URL } from "types/game/game";
import {
	LobbyReceiveEvent,
	LOBBY_RECEIVE_EVENT_BASE_URL,
} from "types/game/lobby";

export const socketGameListeners = (dispatch: Dispatch) => {
	const socket = getGameSocket();
	if (!socket) return;

	console.log("socketGameListeners");

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Start}`,
		(data: any) => {
			console.log(LobbyReceiveEvent.State, data);
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Message}`,
		(data: any) => {
			console.log(LobbyReceiveEvent.State, data);
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Finish}`,
		(data: any) => {
			console.log(LobbyReceiveEvent.State, data);
		}
	);

	socket.on(ChatEvent.Exception, (data: any) => {
		toast.error(data.message);
	});
};

export const removeSocketGameListeners = () => {
	const socket: Socket | undefined = getChatSocket();
	if (!socket) return;

	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Start}`);
	socket.off(ChatEvent.Exception);
};
