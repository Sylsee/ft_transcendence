import {
	authenticate,
	logout,
	setToken,
} from "../../store/auth-slice/auth-slice";
import { RootState } from "../../types/global";
import {
	AnyAction,
	Middleware,
	MiddlewareAPI,
	Dispatch,
} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { JWT_NAME } from "../../config";
import { getUser } from "../../store/selfUser-slice/selfUser-slice";

interface DecodedToken {
	sub: string;
	name: string;
	iat: number;
	exp: number;
}

const actionHandlers: Record<
	string,
	(
		store: MiddlewareAPI<Dispatch<AnyAction>, RootState>,
		next: Dispatch<AnyAction>,
		action: AnyAction
	) => void
> = {
	[authenticate.type]: (store, next, action) => {
		try {
			const cookie = Cookies.get(JWT_NAME);
			if (!cookie) return store.dispatch(logout());

			const token: DecodedToken = jwt_decode(cookie);

			if (new Date() >= new Date(token.exp * 1000))
				return store.dispatch(logout());

			store.dispatch(setToken({ token: cookie }));
			store.dispatch(getUser({ id: token.sub }));
		} catch (error) {
			return store.dispatch(logout());
		}
		return next(action);
	},
	[logout.type]: (store, next, action) => {
		Cookies.remove(JWT_NAME);
		return next(action);
	},
};
const authenticateMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		const handler = actionHandlers[action.type];

		if (handler) handler(store, next, action);
		else next(action);
	};

export { authenticateMiddleware };
