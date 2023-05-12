import { ChatEvent } from "config";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { Socket } from "socket.io-client";
import { getChatSocket } from "sockets/socket";
import {
	addChannel,
	addMessage,
	addServerMessage,
	removeChannel,
} from "store/chat-slice/chat-slice";
import { addCustomNotification } from "store/customNotification-slice/customNotification-slice";
import {
	Message,
	MessageType,
	ServerMessage,
	ServerMessages,
} from "types/chat/chat";
import {
	ChannelNotification,
	CustomNotificationType,
	LobbyNotification,
} from "types/customNotification/customNotification";
import {
	LobbyReceiveEvent,
	LOBBY_RECEIVE_EVENT_BASE_URL,
} from "types/game/lobby";
import { ChannelIdPayload, ChannelPayload } from "types/socket/socket";

export const socketChatListeners = (dispatch: Dispatch) => {
	const socket = getChatSocket();
	if (!socket) return;

	socket.on(ChatEvent.ChannelMessage, (message: Message) => {
		console.log(ChatEvent.ChannelMessage, message);
		dispatch(addMessage(message));
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
		(notification: Omit<ChannelNotification, "type">) => {
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
		dispatch(addChannel(channel));
	});

	socket.on(ChatEvent.ChannelUnavailability, (id: ChannelIdPayload) => {
		console.log(ChatEvent.ChannelUnavailability, id);
		dispatch(removeChannel(id));
	});

	socket.on(
		`${LOBBY_RECEIVE_EVENT_BASE_URL}${LobbyReceiveEvent.Invite}`,
		(notification: Omit<LobbyNotification, "type">) => {
			console.log(LobbyReceiveEvent.Invite, notification);
			dispatch(
				addCustomNotification({
					...notification,
					type: CustomNotificationType.LobbyInvitation,
				})
			);
		}
	);
};

export const removeSocketChatListeners = () => {
	const socket: Socket | undefined = getChatSocket();
	if (!socket) return;

	socket.off(ChatEvent.Message);
	socket.off(ChatEvent.ChannelMessage);
	socket.off(ChatEvent.Notification);
	socket.off(ChatEvent.NotificationInvite);
	socket.off(ChatEvent.ChannelAvailable);
	socket.off(ChatEvent.ChannelUnavailability);
	socket.off(ChatEvent.Exception);
	socket.off(`${LOBBY_RECEIVE_EVENT_BASE_URL}${LobbyReceiveEvent.Invite}`);
};
