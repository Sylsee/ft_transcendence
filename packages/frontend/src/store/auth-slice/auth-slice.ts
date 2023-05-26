import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStatus } from "types/auth/auth";
import { AuthState } from "../../types/auth/reducer";

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
		logout() {},
		resetAuthState() {
			return initialState;
		},
	},
});

export const {
	authenticate,
	setAuthState,
	setTwoFactorAuthEnabled,
	logout,
	resetAuthState,
} = authSlice.actions;
