import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { getChatSocket, getGameSocket } from "sockets/socket";
import { setGame, setLobbyStatus } from "store/game-slice/game-slice";
import {
	GameData,
	GameReceiveEvent,
	GAME_RECEIVE_EVENT_BASE_URL,
} from "types/game/game";
import { LobbyState, LOBBY_RECEIVE_EVENT_BASE_URL } from "types/game/lobby";

export const socketGameListeners = (dispatch: Dispatch) => {
	const socket = getGameSocket();
	if (!socket) return;

	console.log("socketGameListeners");

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Start}`,
		(data: any) => {
			console.log(GameReceiveEvent.Start, JSON.stringify(data));
			dispatch(setLobbyStatus(LobbyState.Start));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Message}`,
		(data: any) => {
			console.log(GameReceiveEvent.Message, data);
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Finish}`,
		(data: any) => {
			console.log(GameReceiveEvent.Finish, data);
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameCountdown}`,
		(data: any) => {
			console.log(GameReceiveEvent.GameCountdown, data);
			dispatch(setLobbyStatus(LobbyState.Countdown));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameState}`,
		(game: GameData) => {
			console.log(GameReceiveEvent.GameState, game);
			dispatch(setGame(game));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameScore}`,
		(data: any) => {
			console.log(GameReceiveEvent.GameScore, data);
		}
	);
};

export const removeSocketGameListeners = () => {
	const socket: Socket | undefined = getChatSocket();
	if (!socket) return;

	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Start}`);
	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Message}`);
	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Finish}`);
	socket.off(
		`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameCountdown}`
	);
	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameState}`);
	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameScore}`);
};
