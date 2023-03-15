// create a auth slice in the store

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	isAuth: boolean;
	token: string | null;
}

const initialState: AuthState = {
	isAuth: false,
	token: null,
};

interface AuthenticatePayload {
	token: string;
}

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		authenticate(state, action: PayloadAction<AuthenticatePayload>) {
			state.isAuth = true;
			state.token = action.payload.token;
		},
		logout(state) {
			state.isAuth = false;
			state.token = null;
		},
	},
});

const { authenticate, logout } = authSlice.actions;

export { authenticate, logout };
