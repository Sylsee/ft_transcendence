import { InvitationToast } from "components/InvitationToast/InvitationToast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeCustomNotification } from "store/customNotification-slice/customNotification-slice";
import { CustomNotificationType } from "types/customNotification";
import { RootState } from "types/global";

interface ToastManagerProps {}

const ToastManager: React.FC<ToastManagerProps> = () => {
	// redux
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state: RootState) => state.CUSTOM_NOTIFICATION.notifications
	);

	useEffect(() => {
		notifications.forEach((notification, index) => {
			if (
				notification.type === CustomNotificationType.ChannelInvitation
			) {
				toast(
					<InvitationToast
						content={notification.content}
						channelId={notification.channelId}
					/>,
					{
						onClose: () => {
							dispatch(removeCustomNotification(index));
						},
					}
				);
			}
		});
	}, [notifications, dispatch]);

	return null;
};

export { ToastManager };
