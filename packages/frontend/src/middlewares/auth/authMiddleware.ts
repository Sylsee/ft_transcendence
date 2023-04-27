import {
	AnyAction,
	Dispatch,
	Middleware,
	MiddlewareAPI,
} from "@reduxjs/toolkit";
import { JWT_NAME } from "config";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
	authenticate,
	logout,
	setAuthState,
} from "store/auth-slice/auth-slice";
import { getUser } from "store/selfUser-slice/selfUser-slice";
import { AuthStatus, DecodedToken } from "types/auth";
import { RootState } from "types/global";

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

			const payload = {
				isAuth:
					!token.isTwoFactorAuthenticated &&
					token.isTwoFactorAuthEnabled
						? AuthStatus.PartiallyAuthenticated
						: AuthStatus.Authenticated,
				isTwoFactorAuthEnabled: token.isTwoFactorAuthEnabled,
			};

			store.dispatch(setAuthState(payload));
			if (payload.isAuth === AuthStatus.Authenticated)
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
