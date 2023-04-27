import { AuthState } from "types/auth";
import { ChatState } from "types/chat";
import { CustomNotificationState } from "types/customNotification";
import { SocketState } from "types/socket";
import { TooltipState } from "types/toolTip";
import { SelfUserState } from "types/user";

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
