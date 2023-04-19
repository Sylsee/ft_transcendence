import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { ChatEvent } from "../../config";
import {
	handleChannelMessage,
	handleNewChannel,
	handleRemovedChannel,
} from "../../store/socket-slice/socket-slice";
import { Message } from "../../types/chat";
import { ChannelIdPayload, ChannelPayload } from "../../types/socket";
import { getSocket } from "../socket";

export const socketChatListeners = (dispatch: Dispatch) => {
	const socket = getSocket();
	if (!socket) return;

	socket.on(ChatEvent.CHANNEL_MESSAGE, (message: Message) => {
		console.log(ChatEvent.CHANNEL_MESSAGE, message);
		dispatch(handleChannelMessage(message));
	});

	socket.on(ChatEvent.NOTIFICATION, (data) => {
		console.log(ChatEvent.NOTIFICATION, data);
		toast.info(data.message);
	});

	socket.on(ChatEvent.NOTIFICATION_INVITE, (data) => {
		console.log(ChatEvent.NOTIFICATION_INVITE, data);
	});

	socket.on(ChatEvent.CHANNEL_VISIBLE, (channel: ChannelPayload) => {
		console.log(ChatEvent.CHANNEL_VISIBLE, channel);
		dispatch(handleNewChannel(channel));
	});

	socket.on(ChatEvent.CHANNEL_INVISIBLE, (id: ChannelIdPayload) => {
		console.log(ChatEvent.CHANNEL_INVISIBLE, id);
		dispatch(handleRemovedChannel(id));
	});
};

export const removeSocketChatListeners = () => {
	const socket: Socket | undefined = getSocket();
	if (!socket) return;

	socket.off(ChatEvent.MESSAGE);
	socket.off(ChatEvent.CHANNEL_MESSAGE);
	socket.off(ChatEvent.NOTIFICATION);
	socket.off(ChatEvent.NOTIFICATION_INVITE);
	socket.off(ChatEvent.CHANNEL_VISIBLE);
	socket.off(ChatEvent.CHANNEL_INVISIBLE);
};
