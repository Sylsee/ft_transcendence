import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channel, ChatState, Message } from "../../types/chat";
import { RootState } from "../../types/global";
import { ChannelIdPayload } from "../../types/socket";

const initialState: ChatState = {
	channels: [],
	activeChannelId: null,
};

export const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setChannels: (state, action: PayloadAction<Channel[]>) => {
			state.channels = action.payload.map((channel) => ({
				...channel,
				hasBeenFetched: false,
				messages: [],
			}));
		},
		addChannel: (state, action: PayloadAction<Channel>) => {
			// TODO check if channel already exists
			state.channels.push({
				...action.payload,
				hasBeenFetched: false,
				messages: [],
			});
		},
		setActiveChannel: (state, action: PayloadAction<string | null>) => {
			state.activeChannelId = action.payload;
		},
		updateChannel: (state, action: PayloadAction<Partial<Channel>>) => {
			const index = state.channels.findIndex(
				(channel) => channel.id === action.payload.id
			);
			if (index !== -1) {
				state.channels[index] = {
					...state.channels[index],
					...action.payload,
				};
			}
		},
		removeChannel: (state, action: PayloadAction<ChannelIdPayload>) => {
			if (state.activeChannelId === action.payload.id)
				state.activeChannelId = null;
			state.channels = state.channels.filter(
				(channel) => channel.id !== action.payload.id
			);
		},
		addMessage: (state, action: PayloadAction<Message>) => {
			console.log("addMessage", action.payload);
		},
	},
});

export const selectActiveChannel = createSelector(
	(state: RootState) => state.CHAT.channels,
	(state: RootState) => state.CHAT.activeChannelId,
	(channels, activeChannelId) =>
		channels.find((channel) => channel.id === activeChannelId) || null
);

export const {
	setChannels,
	addChannel,
	setActiveChannel,
	updateChannel,
	removeChannel,
	addMessage,
} = chatSlice.actions;
