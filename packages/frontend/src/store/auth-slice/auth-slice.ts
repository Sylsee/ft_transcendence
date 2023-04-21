import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthStatus } from "../../types/auth";

const initialState: AuthState = {
	isAuth: AuthStatus.NotAuthenticated,
	isTwoFactorAuthEnabled: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		authenticate(state) {},
		setAuthState(state, action: PayloadAction<AuthState>) {
			state.isAuth = action.payload.isAuth;
			state.isTwoFactorAuthEnabled =
				action.payload.isTwoFactorAuthEnabled;
		},
		setTwoFactorAuthEnabled(state, action: PayloadAction<boolean>) {
			state.isTwoFactorAuthEnabled = action.payload;
		},
		logout(state) {
			state.isAuth = AuthStatus.NotAuthenticated;
		},
	},
});

export const { authenticate, setAuthState, setTwoFactorAuthEnabled, logout } =
	authSlice.actions;
