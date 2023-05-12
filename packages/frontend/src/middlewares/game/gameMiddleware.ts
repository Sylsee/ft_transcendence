import {
	AnyAction,
	Dispatch,
	Middleware,
	MiddlewareAPI,
} from "@reduxjs/toolkit";
import { logout } from "store/auth-slice/auth-slice";
import { setLobby } from "store/game-slice/game-slice";
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
