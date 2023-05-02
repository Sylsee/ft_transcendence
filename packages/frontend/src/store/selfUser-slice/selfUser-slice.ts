import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	GetUserPayload,
	SelfUserState,
	User,
	UserStatus,
} from "types/user/user";

const initialState: SelfUserState = {
	user: null,
};

export const selfUserSlice = createSlice({
	name: "selfUser",
	initialState,
	reducers: {
		getUser(state, action: PayloadAction<GetUserPayload>) {},
		setUser(state, action: PayloadAction<User>) {
			state.user = { ...action.payload, status: UserStatus.Active };
		},
	},
});

export const { getUser, setUser } = selfUserSlice.actions;
