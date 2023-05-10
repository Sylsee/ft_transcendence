// auth slice
import { AuthStatus } from "./auth";

export interface AuthState {
	isAuth: AuthStatus;
	isTwoFactorAuthEnabled: boolean;
}

// auth reducer
export interface AuthenticatePayload {
	token: string;
}