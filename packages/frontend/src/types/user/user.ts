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
	profilePictureUrl: string;
	status?: UserStatus;
	isTwoFactorAuthEnabled?: boolean;
}

// interface FriendsRequests {
// 	id: number;
// 	name: string;
// }

export enum UserRelationship {
	BlockRequestReceived,
	BlockRequestSent,
	NotFriends,
	FriendRequestReceived,
	FriendRequestSent,
	Friends,
}

export interface SelfUserState {
	user: User | null;
}

export interface getUserPayload {
	id: string;
}

// API Routes
export interface UpdateUserRequest {
	name: string;
}

export interface UploadProfilePictureRequest {
	profilePicture: File;
}
