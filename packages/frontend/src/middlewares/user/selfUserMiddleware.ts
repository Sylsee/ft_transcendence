import {
	AnyAction,
	Dispatch,
	Middleware,
	MiddlewareAPI,
} from "@reduxjs/toolkit";
import { fetchUserById } from "../../api/user/userRequests";
import { logout } from "../../store/auth-slice/auth-slice";
import { getUser, setUser } from "../../store/selfUser-slice/selfUser-slice";
import { RootState } from "../../types/global";
import { User } from "../../types/user";

const actionHandlers: Record<
	string,
	(
		store: MiddlewareAPI<Dispatch<AnyAction>, RootState>,
		next: Dispatch<AnyAction>,
		action: AnyAction
	) => void
> = {
	[getUser.type]: async (store, next, action) => {
		try {
			const user: User = await fetchUserById(action.payload.id);
			store.dispatch(setUser(user));
		} catch (error) {
			store.dispatch(logout());
		}
		return next(action);
	},
	[setUser.type]: (store, next, action) => {
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
