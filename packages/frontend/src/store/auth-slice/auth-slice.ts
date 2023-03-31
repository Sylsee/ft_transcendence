import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticatePayload, AuthState } from "../../types/auth";

const initialState: AuthState = {
	isAuth: true,
	token: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		authenticate(state) {
			state.isAuth = true;
		},
		setToken(state, action: PayloadAction<AuthenticatePayload>) {
			state.token = action.payload.token;
		},
		logout(state) {
			state.isAuth = false;
			state.token = null;
		},
	},
});

const { authenticate, setToken, logout } = authSlice.actions;

export { authenticate, setToken, logout };
