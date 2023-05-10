import { configureStore } from "@reduxjs/toolkit";
import { authenticateMiddleware } from "middlewares/auth/authMiddleware";
import { socketMiddleware } from "middlewares/socket/socketMiddleware";
import { selfUserMiddleware } from "middlewares/user/selfUserMiddleware";
import { authSlice } from "store/auth-slice/auth-slice";
import { chatSlice } from "store/chat-slice/chat-slice";
import { customNotificationSlice } from "store/customNotification-slice/customNotification-slice";
import { selfUserSlice } from "store/selfUser-slice/selfUser-slice";
import { socketSlice } from "store/socket-slice/socket-slice";
import { tooltipSlice } from "store/toolTip-slice/toolTip-slice";

const rootReducer = {
	AUTH: authSlice.reducer,
	USER: selfUserSlice.reducer,
	CHAT: chatSlice.reducer,
	SOCKET: socketSlice.reducer,
	CUSTOM_NOTIFICATION: customNotificationSlice.reducer,
	TOOLTIP: tooltipSlice.reducer,
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
