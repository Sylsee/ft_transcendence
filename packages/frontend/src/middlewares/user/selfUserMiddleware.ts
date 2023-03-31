import {
	getUser,
	setUser,
	update,
} from "../../store/selfUser-slice/selfUser-slice";
import { RootState } from "../../types/global";
import {
	AnyAction,
	Middleware,
	MiddlewareAPI,
	Dispatch,
} from "@reduxjs/toolkit";
import { User } from "../../types/user";
import { fetchUserById } from "../../api/user/userRequests";

const actionHandlers: Record<
	string,
	(
		store: MiddlewareAPI<Dispatch<AnyAction>, RootState>,
		next: Dispatch<AnyAction>,
		action: AnyAction
	) => void
> = {
	[getUser.type]: async (store, next, action) => {
		if (!store.getState().AUTH.isAuth) return;

		try {
			const user: User = await fetchUserById(action.payload.id);
			store.dispatch(setUser(user));
		} catch (error) {
			console.log("error");
		}

		return next(action);
	},
	[setUser.type]: (store, next, action) => {
		return next(action);
	},
	[update.type]: (store, next, action) => {
		return next(action);
	},
};
const selfUserMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		const handler = actionHandlers[action.type];

		if (handler) handler(store, next, action);
		else next(action);
	};

export { selfUserMiddleware };
