import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { getChatSocket, getGameSocket } from "sockets/socket";
import {
	addPowerUpBall,
	removePowerUpBall,
	setCountDown,
	setGame,
	setGameConfig,
	setGameScore,
	setLobbyStatus,
	setPowerUp,
} from "store/game-slice/game-slice";
import {
	GameConfig,
	GameData,
	GameReceiveEvent,
	GameScore,
	GAME_RECEIVE_EVENT_BASE_URL,
	PowerUpBall,
	PowerUpDespawn,
	PowerUpStatus,
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
		(message: any) => {
			console.log(GameReceiveEvent.Message, message);
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.Finish}`,
		(gameScore: GameScore) => {
			console.log(GameReceiveEvent.Finish, gameScore);
			dispatch(setLobbyStatus(LobbyState.Finish));
			dispatch(setGameScore(gameScore));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.GameCountdown}`,
		(countdown: any) => {
			console.log(GameReceiveEvent.GameCountdown, countdown);
			dispatch(setCountDown(countdown.seconds));
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

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.IsPowerUpActive}`,
		(powerUpStatus: PowerUpStatus) => {
			dispatch(setPowerUp(powerUpStatus.isActive));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.PowerUpSpawn}`,
		(ball: PowerUpBall) => {
			console.log(GameReceiveEvent.PowerUpSpawn, ball);
			dispatch(addPowerUpBall(ball));
		}
	);

	socket.on(
		`${GAME_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.PowerUpDespawn}`,
		(data: PowerUpDespawn) => {
			console.log(GameReceiveEvent.PowerUpDespawn, data);
			dispatch(removePowerUpBall(data.id));
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
	socket.off(
		`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.IsPowerUpActive}`
	);
	socket.off(
		`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.PowerUpSpawn}`
	);
	socket.off(
		`${LOBBY_RECEIVE_EVENT_BASE_URL}${GameReceiveEvent.PowerUpDespawn}`
	);
};
