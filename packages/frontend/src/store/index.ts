import { configureStore } from "@reduxjs/toolkit";
import { authenticateMiddleware } from "../middlewares/auth/authMiddleware";
import { selfUserMiddleware } from "../middlewares/user/selfUserMiddleware";
import { authSlice } from "./auth-slice/auth-slice";
import { selfUserSlice } from "./selfUser-slice/selfUser-slice";

const rootReducer = {
	AUTH: authSlice.reducer,
	USER: selfUserSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authenticateMiddleware)
			.concat(selfUserMiddleware),
});

export { store };
