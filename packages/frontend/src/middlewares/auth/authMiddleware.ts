import { authenticate } from "../../store/auth-slice/auth-slice";
import { RootState } from "../../store/store-types";
import { Middleware } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../../config";

const authenticateMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		// Votre logique personnalisée pour l'action authenticate
		if (action.type === authenticate.type) {
			console.log("Authenticate middleware triggered");
			console.log(BACKEND_URL);
			// Faites ici ce que vous voulez avec l'action authenticate
		}

		// Passez l'action au middleware suivant ou au reducer
		return next(action);
	};

export default authenticateMiddleware;
