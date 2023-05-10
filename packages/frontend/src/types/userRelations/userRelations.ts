// user relations
import { User } from "../user/user";

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

export enum UserListType {
	FriendList,
	ReceivedFriendRequests,
	SentFriendRequests,
	BlockedUsers,
}

export type FriendRequest = User;

export enum FriendRequestType {
	Received = "received",
	Sent = "sent",
}