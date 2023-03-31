import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserPayload, SelfUserState } from "../../types/user";
import { User } from "../../types/user";

const initialState: SelfUserState = {
	user: null,
};

export const selfUserSlice = createSlice({
	name: "selfUser",
	initialState,
	reducers: {
		getUser(state, action: PayloadAction<getUserPayload>) {},
		setUser(state, action: PayloadAction<User>) {
			state.user = action.payload;
		},
		update(state, action: PayloadAction<User>) {
			state.user = action.payload;
		},
	},
});

const { getUser, setUser, update } = selfUserSlice.actions;

export { getUser, setUser, update };
