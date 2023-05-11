// auth
export enum AuthStatus {
	NotAuthenticated,
	PartiallyAuthenticated,
	Authenticated,
}

export interface DecodedToken {
	sub: string;
	isTwoFactorAuthenticated: boolean;
	isTwoFactorAuthEnabled: boolean;
	name: string;
	iat: number;
	exp: number;
}

