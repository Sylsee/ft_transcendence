import { AuthState } from "types/auth/auth";
import { ChatState } from "types/chat/chat";
import { CustomNotificationState } from "types/customNotification/customNotification";
import { SocketState } from "types/socket/socket";
import { TooltipState } from "types/toolTip/toolTip";
import { SelfUserState } from "types/user/user";

export interface RootState {
	AUTH: AuthState;
	USER: SelfUserState;
	CHAT: ChatState;
	SOCKET: SocketState;
	CUSTOM_NOTIFICATION: CustomNotificationState;
	TOOLTIP: TooltipState;
}

export interface ApiErrorResponse {
	error: number;
	message: string[];
	statusCode: number;
}
