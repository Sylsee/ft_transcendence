import { AuthState } from "./auth";
import { ChatState } from "./chat";
import { CustomNotificationState } from "./customNotification";
import { SocketState } from "./socket";
import { TooltipState } from "./toolTip";
import { SelfUserState } from "./user";

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
