import { configureStore } from "@reduxjs/toolkit";
import { authenticateMiddleware } from "../middlewares/auth/authMiddleware";
import { authSlice } from "./auth-slice/auth-slice";

const rootReducer = {
	AUTH: authSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authenticateMiddleware),
});

export { store };
