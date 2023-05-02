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
	Active = "active",
	Inactive = "inactive",
}

export interface User {
	id: string;
	name: string;
	profilePictureUrl: string;
	status?: UserStatus;
	isTwoFactorAuthEnabled?: boolean;
}

export enum FriendStatusType {
	BlockRequestReceived = "blockRequestReceived",
	BlockRequestSent = "blockRequestSent",
	NotFriends = "notFriends",
	FriendRequestReceived = "friendRequestReceived",
	FriendRequestSent = "friendRequestSent",
	Friends = "friends",
	Block = "block",
	Pending = "pending",
}

export interface SelfUserState {
	user: User | null;
}

export interface GetUserPayload {
	id: string;
}

export interface UserRelationState {
	loaders: Record<string, boolean>;
}

// API Routes
export interface UpdateUserRequest {
	name: string;
}

export interface UploadProfilePictureRequest {
	profilePicture: File;
}

export interface UpdateFriendRequestData {
	status: boolean;
}

export interface UpdateFriendRequest {
	id: string;
	data: UpdateFriendRequestData;
}

export interface FriendStatusQueryResponse {
	status: FriendStatusType;
}

export type FriendRequest = User;

export interface FriendRequestQueryResponse {
	received: FriendRequest[];
	sent: FriendRequest[];
}

export interface ButtonProps {
	name: string;
	color: string;
	handleClick: (id: string) => void;
}

export interface ButtonPropsList {
	buttons?: ButtonProps[];
}

export enum UserListType {
	FriendList,
	ReceivedFriendRequests,
	SentFriendRequests,
	BlockedUsers,
}

export interface MutationContextIdType {
	id: string | undefined;
}

export enum FriendRequestType {
	Received = "received",
	Sent = "sent",
}
