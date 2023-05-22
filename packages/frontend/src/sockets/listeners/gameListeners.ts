import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { getChatSocket, getGameSocket } from "sockets/socket";
import {
	setCountDown,
	setGame,
	setGameConfig,
	setGameScore,
	setLobbyStatus,
} from "store/game-slice/game-slice";
import {
	GameConfig,
	GameData,
	GameReceiveEvent,
	GameScore,
	GAME_RECEIVE_EVENT_BASE_URL,
} from "types/game/game";
import { LobbyState, LOBBY_RECEIVE_EVENT_BASE_URL } from "types/game/lobby";

export const socketGameListeners = (dispatch: Dispatch) => {
	const socket = getGameSocket();
	if (!socket) return;

	console.log("socketGameListeners");

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Start}`,
		(config: GameConfig) => {
			console.log(GameReceiveEvent.Start, JSON.stringify(config));
			dispatch(setLobbyStatus(LobbyState.Start));
			dispatch(setGameConfig({ ...config, isLeftPlayer: true }));
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
		(data: GameScore) => {
			console.log(GameReceiveEvent.Finish, data);
			dispatch(setLobbyStatus(LobbyState.Finish));
			dispatch(setGameScore(data));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameCountdown}`,
		(data: any) => {
			console.log(GameReceiveEvent.GameCountdown, data);
			dispatch(setCountDown(data.seconds));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameState}`,
		(game: GameData) => {
			dispatch(setGame(game));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameScore}`,
		(score: Omit<GameScore, "winner">) => {
			console.log(GameReceiveEvent.GameScore, score);
			dispatch(setGameScore({ ...score, winner: null }));
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
