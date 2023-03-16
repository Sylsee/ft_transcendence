export interface AuthState {
	isAuth: boolean;
	token: string | null;
}

export interface RootState {
	AUTH: AuthState;
}
