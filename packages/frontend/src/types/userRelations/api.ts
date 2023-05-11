import { FriendRequest, FriendStatusType } from "./userRelations";

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

export interface FriendRequestQueryResponse {
	received: FriendRequest[];
	sent: FriendRequest[];
}

export interface MutationContextIdType {
	id: string | undefined;
}

