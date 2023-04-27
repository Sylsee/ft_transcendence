import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserPayload, SelfUserState, User, UserStatus } from "types/user";

const initialState: SelfUserState = {
	user: null,
};

export const selfUserSlice = createSlice({
	name: "selfUser",
	initialState,
	reducers: {
		getUser(state, action: PayloadAction<getUserPayload>) {},
		setUser(state, action: PayloadAction<User>) {
			state.user = { ...action.payload, status: UserStatus.Online };
		},
	},
});

export const { getUser, setUser } = selfUserSlice.actions;
