import {
	AnyAction,
	Dispatch,
	Middleware,
	MiddlewareAPI,
} from "@reduxjs/toolkit";
import { logout } from "store/auth-slice/auth-slice";
import {
	setGameConfig,
	setLobby,
	setLobbyStatus,
} from "store/game-slice/game-slice";
import { LobbyState } from "types/game/lobby";
import { RootState } from "types/global/global";

const actionHandlers: Record<
	string,
	(
		store: MiddlewareAPI<Dispatch<AnyAction>, RootState>,
		next: Dispatch<AnyAction>,
		action: AnyAction
	) => void
> = {
	[setLobby.type]: async (store, next, action) => {
		const id = store.getState().USER.user?.id;

		if (!id) return store.dispatch(logout());

		if (action.payload.players[0].id !== id) {
			action.payload.players.reverse();
		}

		if (store.getState().GAME.lobby === null) {
			store.dispatch(setLobbyStatus(LobbyState.Found));
		}

		if (action.payload.hasFinished) {
			store.dispatch(setLobbyStatus(LobbyState.Finish));
		}

		return next(action);
	},
	[setGameConfig.type]: async (store, next, action) => {
		const isLeftPlayer =
			action.payload.player1 === store.getState().USER.user?.id;

		action.payload = {
			...action.payload,
			isLeftPlayer,
		};

		return next(action);
	},
};
const gameMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		const handler = actionHandlers[action.type];

		if (handler) handler(store, next, action);
		else next(action);
	};

export { gameMiddleware };
