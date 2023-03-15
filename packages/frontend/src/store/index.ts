import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth-slice/auth-slice";

const rootReducer = {
	AUTH: authSlice.reducer,
};

const store = configureStore({
	reducer: rootReducer,
});

export { store };
