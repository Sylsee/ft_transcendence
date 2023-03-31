import { AuthState } from "./auth";
import { SelfUserState } from "./user";

export interface RootState {
	AUTH: AuthState;
	USER: SelfUserState;
}
