import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { ChatEvent } from "../../config";
import { addServerMessage } from "../../store/chat-slice/chat-slice";
import { addCustomNotification } from "../../store/customNotification-slice/customNotification-slice";
import {
	handleChannelMessage,
	handleNewChannel,
	handleRemovedChannel,
} from "../../store/socket-slice/socket-slice";
import { Message, ServerMessage } from "../../types/chat";
import {
	ChannelNotifications,
	CustomNotificationType,
} from "../../types/customNotification";
import { ChannelIdPayload, ChannelPayload } from "../../types/socket";
import { getSocket } from "../socket";

export const socketChatListeners = (dispatch: Dispatch) => {
	const socket = getSocket();
	if (!socket) return;

	socket.on(ChatEvent.ChannelMessage, (message: Message) => {
		console.log(ChatEvent.ChannelMessage, message);
		dispatch(handleChannelMessage(message));
	});

	socket.on(
		ChatEvent.ChannelServerMessage,
		(serverMessage: ServerMessage) => {
			console.log(ChatEvent.ChannelServerMessage, serverMessage);
			dispatch(addServerMessage(serverMessage));
		}
	);

	socket.on(
		ChatEvent.NotificationInvite,
		(notification: Omit<ChannelNotifications, "type">) => {
			console.log(ChatEvent.Notification, notification);
			dispatch(
				addCustomNotification({
					...notification,
					type: CustomNotificationType.ChannelInvitation,
				})
			);
		}
	);

	socket.on(ChatEvent.Exception, (data: any) => {
		toast.error(data.message);
	});

	socket.on(ChatEvent.Notification, (data: any) => {
		console.log(ChatEvent.Notification, data);
		toast.info(data.content);
	});

	socket.on(ChatEvent.ChannelAvailable, (channel: ChannelPayload) => {
		console.log(ChatEvent.ChannelAvailable, channel);
		dispatch(handleNewChannel(channel));
	});

	socket.on(ChatEvent.ChannelUnavailability, (id: ChannelIdPayload) => {
		console.log(ChatEvent.ChannelUnavailability, id);
		dispatch(handleRemovedChannel(id));
	});
};

export const removeSocketChatListeners = () => {
	const socket: Socket | undefined = getSocket();
	if (!socket) return;

	socket.off(ChatEvent.Message);
	socket.off(ChatEvent.ChannelMessage);
	socket.off(ChatEvent.Notification);
	socket.off(ChatEvent.NotificationInvite);
	socket.off(ChatEvent.ChannelAvailable);
	socket.off(ChatEvent.ChannelUnavailability);
	socket.off(ChatEvent.Exception);
};
