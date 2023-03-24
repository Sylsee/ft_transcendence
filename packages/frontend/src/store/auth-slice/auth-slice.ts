import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../store-types";

const initialState: AuthState = {
	isAuth: true,
	token: null,
};

interface AuthenticatePayload {
	token: string;
}

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
