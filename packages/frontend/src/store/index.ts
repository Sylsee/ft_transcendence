import { configureStore } from "@reduxjs/toolkit";
import { authenticateMiddleware } from "middlewares/auth/authMiddleware";
import { gameMiddleware } from "middlewares/game/gameMiddleware";
import { selfUserMiddleware } from "middlewares/user/selfUserMiddleware";
import { authSlice } from "store/auth-slice/auth-slice";
import { chatSlice } from "store/chat-slice/chat-slice";
import { customNotificationSlice } from "store/customNotification-slice/customNotification-slice";
import { gameSlice } from "store/game-slice/game-slice";
import { selfUserSlice } from "store/selfUser-slice/selfUser-slice";
import { tooltipSlice } from "store/toolTip-slice/toolTip-slice";

const rootReducer = {
	AUTH: authSlice.reducer,
	USER: selfUserSlice.reducer,
	CHAT: chatSlice.reducer,
	CUSTOM_NOTIFICATION: customNotificationSlice.reducer,
	TOOLTIP: tooltipSlice.reducer,
	GAME: gameSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authenticateMiddleware)
			.concat(selfUserMiddleware)
			.concat(gameMiddleware),
});

export { store };
