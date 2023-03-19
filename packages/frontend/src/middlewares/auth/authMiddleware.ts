import {
	authenticate,
	logout,
	setToken,
} from "../../store/auth-slice/auth-slice";
import { RootState } from "../../store/store-types";
import {
	AnyAction,
	Middleware,
	MiddlewareAPI,
	Dispatch,
} from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

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
			const cookie = Cookies.get("jwt");
			if (cookie) {
				const token = jwt_decode(cookie) as DecodedToken;

				if (new Date() >= new Date(token.exp * 1000))
					return store.dispatch(logout());
				else store.dispatch(setToken({ token: cookie }));
			} else return store.dispatch(logout());
		} catch (error) {
			return store.dispatch(logout());
		}
		return next(action);
	},
	[logout.type]: (store, next, action) => {
		Cookies.remove("jwt");
		return next(action);
	},
};
const authenticateMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		const handler = actionHandlers[action.type];

		if (handler) handler(store, next, action);
		else next(action);
	};

export default authenticateMiddleware;
