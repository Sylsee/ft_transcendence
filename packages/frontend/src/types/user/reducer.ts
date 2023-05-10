// user slice
import { User } from "./user";

export interface SelfUserState {
	user: User | null;
}

export interface GetUserPayload {
	id: string;
}