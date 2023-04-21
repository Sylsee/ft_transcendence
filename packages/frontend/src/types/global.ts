import { AuthState } from "./auth";
import { ChatState } from "./chat";
import { SocketState } from "./socket";
import { SelfUserState } from "./user";

export interface RootState {
	AUTH: AuthState;
	USER: SelfUserState;
	CHAT: ChatState;
	SOCKET: SocketState;
}

export interface ApiErrorResponse {
	error: number;
	message: string[];
	statusCode: number;
}
