import { AuthState } from "./auth";
import { SelfUserState } from "./user";

export interface RootState {
	AUTH: AuthState;
	USER: SelfUserState;
}

export interface ApiErrorResponse {
	error: number;
	message: string[];
	statusCode: number;
}
