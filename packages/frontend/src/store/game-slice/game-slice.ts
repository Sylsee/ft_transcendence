import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameData } from "types/game/game";
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
			state.game = action.payload;
		},
	},
});

export const {
	setLobbyStatus,
	setLobby,
	cleanLobby,
	setIsLobbyOwner,
	setGame,
} = gameSlice.actions;
