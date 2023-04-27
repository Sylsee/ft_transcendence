import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "types/chat";
import { ChannelIdPayload, ChannelPayload, SocketState } from "types/socket";

const initialState: SocketState = {};

export const socketSlice = createSlice({
	name: "socket",
	initialState,
	reducers: {
		handleChannelMessage(state, action: PayloadAction<Message>) {},
		handleNotification(state, action: PayloadAction<null>) {},
		handleNotificationInvite(state, action: PayloadAction<null>) {},
		handleNewChannel(state, action: PayloadAction<ChannelPayload>) {},
		handleRemovedChannel(state, action: PayloadAction<ChannelIdPayload>) {},
	},
});

export const {
	handleChannelMessage,
	handleNotification,
	handleNotificationInvite,
	handleNewChannel,
	handleRemovedChannel,
} = socketSlice.actions;
