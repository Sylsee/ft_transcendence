import {
	authenticate,
	logout,
	setToken,
} from "../../store/auth-slice/auth-slice";
import { RootState } from "../../store/store-types";
import { Middleware } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

interface DecodedToken {
	sub: string;
	name: string;
	iat: number;
	exp: number;
}

const authenticateMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		if (action.type === authenticate.type) {
			try {
				const cookie = Cookies.get("jwt");
				if (cookie) {
					const token = jwt_decode(cookie) as DecodedToken;
					console.log(token);

					if (new Date() >= new Date(token.exp * 1000)) {
						store.dispatch(logout());
					} else store.dispatch(setToken({ token: cookie }));
				} else store.dispatch(logout());
			} catch (error) {
				store.dispatch(logout());
			}
			//const toke
		} else if (action.type === logout.type) {
			Cookies.remove("jwt");
			console.log("YO");
		}

		// Passez l'action au middleware suivant ou au reducer
		return next(action);
	};

export default authenticateMiddleware;
