import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	CustomNotification,
	CustomNotificationState,
} from "types/customNotification/customNotification";

const initialState: CustomNotificationState = {
	notifications: [],
};

export const customNotificationSlice = createSlice({
	name: "customNotification",
	initialState: initialState,
	reducers: {
		addCustomNotification: (
			state,
			action: PayloadAction<CustomNotification>
		) => {
			state.notifications.push(action.payload);
		},
		removeCustomNotification: (state, action: PayloadAction<number>) => {
			state.notifications.splice(action.payload, 1);
		},
		resetCustomNotificationState() {
			return initialState;
		},
	},
});

export const {
	addCustomNotification,
	removeCustomNotification,
	resetCustomNotificationState,
} = customNotificationSlice.actions;
