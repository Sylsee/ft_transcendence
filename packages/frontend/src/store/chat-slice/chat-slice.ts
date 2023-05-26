import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Channel,
	ChannelModalType,
	ChannelType,
	ChatState,
	Message,
	MessageType,
	ServerMessage,
	SetMessagesPayload,
} from "types/chat/chat";
import { RootState } from "types/global/global";
import { ChannelIdPayload, ChannelPayload } from "types/socket/socket";

const initialState: ChatState = {
	channels: [],
	activeChannelId: null,
	selectedChannelId: null,
	showModal: false,
	showChat: false,
	showChannelModal: ChannelModalType.None,
	isMenuOpen: false,
	chatInput: "",
};

export const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setShowChatModal: (state, action: PayloadAction<boolean>) => {
			state.showModal = action.payload;
		},
		setShowChat: (state, action: PayloadAction<boolean>) => {
			state.showChat = action.payload;
		},
		setIsMenuOpen: (state, action: PayloadAction<boolean>) => {
			state.isMenuOpen = action.payload;
		},
		toggleChatMenu: (state) => {
			state.isMenuOpen = !state.isMenuOpen;
		},
		setShowChannelModal: (
			state,
			action: PayloadAction<ChannelModalType>
		) => {
			state.showChannelModal = action.payload;
		},
		setChannels: (state, action: PayloadAction<Channel[]>) => {
			state.channels = action.payload.map((channel) => ({
				...channel,
				hasBeenFetched: false,
				messages: [],
			}));
		},
		setMessages: (state, action: PayloadAction<SetMessagesPayload>) => {
			const channel = state.channels.find(
				(channel) => channel.id === action.payload.channelId
			);
			if (channel) {
				channel.messages = action.payload.messages.map((message) => ({
					...message,
					type: MessageType.Normal,
				}));
				channel.hasBeenFetched = true;
			}
		},
		addChannel: (state, action: PayloadAction<ChannelPayload>) => {
			const index = state.channels.findIndex(
				(channel) => channel.id === action.payload.id
			);
			if (index !== -1) {
				if (
					action.payload.permissions.isMember === false &&
					state.activeChannelId === action.payload.id
				)
					state.activeChannelId = null;
				if (
					action.payload.permissions.isMember === false &&
					state.selectedChannelId === action.payload.id
				)
					state.selectedChannelId = null;
				state.channels[index] = {
					...state.channels[index],
					hasBeenFetched: false,
					messages: [],
					...action.payload,
				};
			} else {
				state.channels.push({
					...action.payload,
					hasBeenFetched: false,
					messages: [],
				});
			}
		},
		/*
		 **	This is a special case of addChannel, where we don't reset the hasBeenFetched
		 **	and the Messages properties.
		 */
		updateChannelSafety: (state, action: PayloadAction<ChannelPayload>) => {
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
			if (state.activeChannelId === action.payload.channelId)
				state.activeChannelId = null;
			if (state.selectedChannelId === action.payload.channelId)
				state.selectedChannelId = null;
			state.channels = state.channels.filter(
				(channel) => channel.id !== action.payload.channelId
			);
		},
		removeChannelById: (state, action: PayloadAction<string>) => {
			if (state.activeChannelId === action.payload)
				state.activeChannelId = null;
			if (state.selectedChannelId === action.payload)
				state.selectedChannelId = null;
			state.channels = state.channels.filter(
				(channel) => channel.id !== action.payload
			);
		},
		addMessage: (state, action: PayloadAction<Message>) => {
			const channel = state.channels.find(
				(channel) =>
					channel.id === action.payload.channelId &&
					channel.hasBeenFetched
			);
			if (channel) {
				channel.messages.push({
					...action.payload,
					type: MessageType.Normal,
				});
			}
		},
		addServerMessage: (state, action: PayloadAction<ServerMessage>) => {
			const channel = state.channels.find(
				(channel) =>
					channel.id === action.payload.channelId &&
					channel.hasBeenFetched
			);
			if (channel) {
				channel.messages.push({
					...action.payload,
					type: MessageType.Special,
				});
			}
		},
		setActiveChannel: (state, action: PayloadAction<string | null>) => {
			state.activeChannelId = action.payload;
		},
		setSelectedChannel: (state, action: PayloadAction<string | null>) => {
			state.selectedChannelId = action.payload;
		},
		setChatInput: (state, action: PayloadAction<string>) => {
			state.chatInput = action.payload;
		},
	},
});

export const selectActiveChannel = createSelector(
	(state: RootState) => state.CHAT.channels,
	(state: RootState) => state.CHAT.activeChannelId,
	(channels, activeChannelId) =>
		channels.find((channel) => channel.id === activeChannelId) || null
);

export const selectSelectedChannel = createSelector(
	(state: RootState) => state.CHAT.channels,
	(state: RootState) => state.CHAT.selectedChannelId,
	(channels, selectedChannelId) =>
		channels.find((channel) => channel.id === selectedChannelId) || null
);

export const selectDirectMessageChannel = createSelector(
	(state: RootState) => state.CHAT.channels,
	(_: RootState, userId: string) => userId,
	(channels, userId) =>
		channels.find(
			(channel) =>
				channel.user &&
				channel.type === ChannelType.Direct_message &&
				channel.user.id === userId
		)
);

export const {
	setChannels,
	addChannel,
	setSelectedChannel,
	setActiveChannel,
	removeChannel,
	addMessage,
	removeChannelById,
	setMessages,
	addServerMessage,
	setShowChatModal,
	updateChannelSafety,
	setShowChat,
	setShowChannelModal,
	setIsMenuOpen,
	toggleChatMenu,
	setChatInput,
} = chatSlice.actions;
