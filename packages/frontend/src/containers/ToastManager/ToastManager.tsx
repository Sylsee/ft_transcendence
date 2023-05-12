import { InvitationToast } from "components/InvitationToast/InvitationToast";
import { useJoinChannel } from "hooks/chat/useJoinChannel";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { emitLobbySocketEvent } from "sockets/socket";
import { removeCustomNotification } from "store/customNotification-slice/customNotification-slice";
import {
	ChannelNotification,
	CustomNotificationType,
	LobbyNotification,
} from "types/customNotification/customNotification";
import { LobbySendEvent } from "types/game/lobby";
import { RootState } from "types/global/global";

interface ToastManagerProps {}

const ToastManager: React.FC<ToastManagerProps> = () => {
	// redux
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.CUSTOM_NOTIFICATION.notifications
	);

	// mutations
	const { mutate } = useJoinChannel();

	// handlers

	const notificationsLengthRef = useRef(notifications.length);

	useEffect(() => {
		const handleDeclineChannelInvitation = () => {};
		const handleAcceptChannelInvitation = (id: string) => {
			mutate({ id, data: {} });
		};

		const handleAcceptLobbyInvitation = (id: string) => {
			emitLobbySocketEvent(LobbySendEvent.JoinLobby, { lobbyId: id });
		};
		const handleDeclineLobbyInvitation = () => {};
		if (notifications.length > notificationsLengthRef.current) {
			// Une nouvelle notification a été ajoutée
			const newNotification = notifications[notifications.length - 1];

			if (
				newNotification.type ===
				CustomNotificationType.ChannelInvitation
			) {
				const channelNotification =
					newNotification as ChannelNotification;
				toast(
					<InvitationToast
						content={channelNotification.content}
						id={channelNotification.channelId}
						handleAccept={handleAcceptChannelInvitation}
						handleDecline={handleDeclineChannelInvitation}
					/>,
					{
						onClose: () => {
							dispatch(
								removeCustomNotification(
									notifications.length - 1
								)
							);
						},
					}
				);
			} else if (
				newNotification.type === CustomNotificationType.LobbyInvitation
			) {
				const lobbyNotification = newNotification as LobbyNotification;
				toast(
					<InvitationToast
						content={lobbyNotification.content}
						id={lobbyNotification.lobbyId}
						handleAccept={handleAcceptLobbyInvitation}
						handleDecline={handleDeclineLobbyInvitation}
					/>,
					{
						onClose: () => {
							dispatch(
								removeCustomNotification(
									notifications.length - 1
								)
							);
						},
					}
				);
			}
		}

		notificationsLengthRef.current = notifications.length;
	}, [notifications, dispatch, mutate]);

	return null;
};

export { ToastManager };
