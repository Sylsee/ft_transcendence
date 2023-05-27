import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TooltipState } from "types/toolTip/toolTip";

const initialState: TooltipState = {
	activeTooltip: null,
};

export const tooltipSlice = createSlice({
	name: "tooltip",
	initialState,
	reducers: {
		setActiveTooltip: (state, action: PayloadAction<string | null>) => {
			state.activeTooltip = action.payload;
		},
		resetTooltipState() {
			return initialState;
		},
	},
});

export const { setActiveTooltip, resetTooltipState } = tooltipSlice.actions;
