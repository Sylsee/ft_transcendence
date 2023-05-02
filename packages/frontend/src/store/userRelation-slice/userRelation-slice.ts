import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "types/global/global";
import { UserRelationState } from "types/user/user";
const initialState: UserRelationState = {
	loaders: {},
};

export const userRelationSlice = createSlice({
	name: "userRelation",
	initialState,
	reducers: {
		startLoading: (state, action: PayloadAction<string>) => {
			console.log("start loading");
			state.loaders[action.payload] = true;
		},
		stopLoading: (state, action: PayloadAction<string>) => {
			console.log("stop loading");
			state.loaders[action.payload] = false;
		},
		clearLoader: (state, action: PayloadAction<string>) => {
			delete state.loaders[action.payload];
		},
	},
});

export const selectLoaderById = createSelector(
	(state: RootState) => state.USER_RELATION.loaders,
	(_: RootState, id: string) => id,
	(loaders, id) => loaders[id] || false
);

export const { startLoading, stopLoading, clearLoader } =
	userRelationSlice.actions;
