import { configureStore } from "@reduxjs/toolkit";
import { authenticateMiddleware } from "../middlewares/auth/authMiddleware";
import { socketMiddleware } from "../middlewares/socket/socketMiddleware";
import { selfUserMiddleware } from "../middlewares/user/selfUserMiddleware";
import { authSlice } from "./auth-slice/auth-slice";
import { chatSlice } from "./chat-slice/chat-slice";
import { selfUserSlice } from "./selfUser-slice/selfUser-slice";
import { socketSlice } from "./socket-slice/socket-slice";

const rootReducer = {
	AUTH: authSlice.reducer,
	USER: selfUserSlice.reducer,
	CHAT: chatSlice.reducer,
	SOCKET: socketSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authenticateMiddleware)
			.concat(selfUserMiddleware)
			.concat(socketMiddleware),
});

export { store };
