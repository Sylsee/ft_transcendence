import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameConfig, GameData, GameScore } from "types/game/game";
import { LobbyData, LobbyState } from "types/game/lobby";
import { GameState } from "types/game/reducer";

const initialState: GameState = {
	lobbyStatus: LobbyState.Idle,
	lobby: null,
	isLobbyOwner: false,
	game: null,
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setLobbyStatus: (state, action: PayloadAction<LobbyState>) => {
			state.lobbyStatus = action.payload;
		},
		setLobby: (state, action: PayloadAction<LobbyData>) => {
			state.lobby = action.payload;
		},
		cleanLobby: (state) => {
			state.lobby = null;
			state.lobbyStatus = LobbyState.Idle;
			state.isLobbyOwner = false;
			state.game = null;
		},
		setIsLobbyOwner: (state, action: PayloadAction<boolean>) => {
			state.isLobbyOwner = action.payload;
		},
		setGame: (state, action: PayloadAction<GameData>) => {
			state.game = { ...state.game, ...action.payload };
		},
		setCountDown: (state, action: PayloadAction<number>) => {
			if (!state.game) return;
			state.game.countDown = action.payload;
		},
		setGameConfig: (
			state,
			action: PayloadAction<GameConfig & { isLeftPlayer: boolean }>
		) => {
			state.game = {
				paddle1: {
					...action.payload.paddleCoordinates.paddle1,
					width: action.payload.paddleWidth,
					height: action.payload.paddleHeight,
					velocity: { y: 0 },
				},
				paddle2: {
					...action.payload.paddleCoordinates.paddle2,
					width: action.payload.paddleWidth,
					height: action.payload.paddleHeight,
					velocity: { y: 0 },
				},
				ball: {
					x: action.payload.ballCoordinates.x,
					y: action.payload.ballCoordinates.y,
					velocity: { x: 0, y: 0 },
					radius: action.payload.ballRadius,
				},
				height: action.payload.height,
				width: action.payload.width,
				maxScore: action.payload.maxScore,
				countDown: -1,
				score: { player1Score: 0, player2Score: 0, winner: null },
				isLeftPlayer: action.payload.isLeftPlayer,
				defaultCoordinates: {
					paddle1: {
						x: action.payload.paddleCoordinates.paddle1.x,
						y: action.payload.paddleCoordinates.paddle1.y,
					},
					paddle2: {
						x: action.payload.paddleCoordinates.paddle2.x,
						y: action.payload.paddleCoordinates.paddle2.y,
					},
					ball: {
						x: action.payload.ballCoordinates.x,
						y: action.payload.ballCoordinates.y,
					},
				},
			};
		},
		setGameScore: (state, action: PayloadAction<GameScore>) => {
			if (!state.game) return;
			state.game.score = action.payload;
			state.game.ball.x = state.game.defaultCoordinates.ball.x;
			state.game.ball.y = state.game.defaultCoordinates.ball.y;
			state.game.paddle1.x = state.game.defaultCoordinates.paddle1.x;
			state.game.paddle1.y = state.game.defaultCoordinates.paddle1.y;
			state.game.paddle2.x = state.game.defaultCoordinates.paddle2.x;
			state.game.paddle2.y = state.game.defaultCoordinates.paddle2.y;
		},
	},
});

export const {
	setLobbyStatus,
	setLobby,
	cleanLobby,
	setIsLobbyOwner,
	setGame,
	setCountDown,
	setGameConfig,
	setGameScore,
} = gameSlice.actions;
