import {
	AnyAction,
	Dispatch,
	Middleware,
	MiddlewareAPI,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
	addChannel,
	addMessage,
	removeChannel,
} from "store/chat-slice/chat-slice";
import {
	handleChannelMessage,
	handleNewChannel,
	handleNotification,
	handleNotificationInvite,
	handleRemovedChannel,
} from "store/socket-slice/socket-slice";
import { RootState } from "types/global/global";

const actionHandlers: Record<
	string,
	(
		store: MiddlewareAPI<Dispatch<AnyAction>, RootState>,
		next: Dispatch<AnyAction>,
		action: AnyAction
	) => void
> = {
	[handleChannelMessage.type]: async (store, next, action) => {
		store.dispatch(addMessage(action.payload));
		return next(action);
	},
	[handleNotification.type]: async (store, next, action) => {
		toast(action.payload);
		return next(action);
	},
	[handleNotificationInvite.type]: async (store, next, action) => {
		// toast(<InvitationToast {...action.payload} />);
		return next(action);
	},
	[handleNewChannel.type]: async (store, next, action) => {
		store.dispatch(addChannel(action.payload));
		return next(action);
	},
	[handleRemovedChannel.type]: async (store, next, action) => {
		store.dispatch(removeChannel(action.payload));
		return next(action);
	},
};
const socketMiddleware: Middleware<{}, RootState> =
	(store) => (next) => async (action) => {
		const handler = actionHandlers[action.type];

		if (handler) handler(store, next, action);
		else next(action);
	};

export { socketMiddleware };
