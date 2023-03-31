export interface AuthState {
	isAuth: boolean;
	token: string | null;
}

export interface AuthenticatePayload {
	token: string;
}
