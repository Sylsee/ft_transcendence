export enum AuthStatus {
	NotAuthenticated,
	PartiallyAuthenticated,
	Authenticated,
}

export interface AuthState {
	isAuth: AuthStatus;
	isTwoFactorAuthEnabled: boolean;
}

export interface AuthenticatePayload {
	token: string;
}

export interface DecodedToken {
	sub: string;
	isTwoFactorAuthenticated: boolean;
	isTwoFactorAuthEnabled: boolean;
	name: string;
	iat: number;
	exp: number;
}
