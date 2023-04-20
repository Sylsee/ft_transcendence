export interface UserStats {
	wins: number;
	losses: number;
}

export interface Match {
	id: string;
	players: User[];
	winner: User;
	date: Date;
}

export enum UserStatus {
	Online = "online",
	Offline = "offline",
}

export interface User {
	id: string;
	name: string;
	avatarUrl: string;
	status?: UserStatus;
	twoFactorAuth?: boolean;
}

// interface FriendsRequests {
// 	id: number;
// 	name: string;
// }

export enum UserRelationship {
	BLOCK_REQUEST_RECEIVED,
	BLOCK_REQUEST_SENT,
	NOT_FRIENDS,
	FRIEND_REQUEST_RECEIVED,
	FRIEND_REQUEST_SENT,
	FRIENDS,
}

export interface SelfUserState {
	user: User | null;
}

export interface getUserPayload {
	id: string;
}

// API Routes
export interface UpdateUserRequest {
	name?: string;
	twoFactorAuth?: boolean;
	avatar?: File;
}
