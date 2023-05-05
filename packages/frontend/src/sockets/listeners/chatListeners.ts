import { ChatEvent } from "config";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { Socket } from "socket.io-client";
import { getSocket } from "sockets/socket";
import { addServerMessage } from "store/chat-slice/chat-slice";
import { addCustomNotification } from "store/customNotification-slice/customNotification-slice";
import {
	handleChannelMessage,
	handleNewChannel,
	handleRemovedChannel,
} from "store/socket-slice/socket-slice";
import {
	Message,
	MessageType,
	ServerMessage,
	ServerMessages,
} from "types/chat/chat";
import {
	ChannelNotifications,
	CustomNotificationType,
} from "types/customNotification/customNotification";
import { ChannelIdPayload, ChannelPayload } from "types/socket/socket";

export const socketChatListeners = (dispatch: Dispatch) => {
	const socket = getSocket();
	if (!socket) return;

	socket.on(ChatEvent.ChannelMessage, (message: Message) => {
		console.log(ChatEvent.ChannelMessage, message);
		dispatch(handleChannelMessage(message));
	});

	socket.on(
		ChatEvent.ChannelServerMessage,
		(serverMessage: ServerMessage | ServerMessages) => {
			console.log(ChatEvent.ChannelServerMessage, serverMessage);

			const messages = Array.isArray(serverMessage.content)
				? serverMessage.content
				: [serverMessage.content];

			messages.forEach((content) => {
				dispatch(
					addServerMessage({
						type: MessageType.Special,
						channelId: serverMessage.channelId,
						content,
					})
				);
			});
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
