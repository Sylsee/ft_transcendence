import { QueryClient } from "@tanstack/react-query";
import {
	FriendRequest,
	FriendRequestQueryResponse,
	FriendRequestType,
	User,
	UserStatus,
} from "types/user/user";

export const cancelFriendQueries = (
	queryClient: QueryClient,
	id: string,
	connectedUserId: string | undefined
) => {
	queryClient.cancelQueries(["friends", id]);
	if (id === connectedUserId) {
		queryClient.cancelQueries(["friendsRequests"]);
		queryClient.cancelQueries(["blockedUsers"]);
	} else {
		queryClient.cancelQueries(["friendStatus", id]);
		queryClient.setQueryData(["friendStatus", id], "pending");
	}
};

export const invalidateFriendQueries = (
	queryClient: QueryClient,
	id: string,
	connectedUserId: string | undefined
) => {
	queryClient.invalidateQueries(["friends", id]);
	if (id === connectedUserId) {
		queryClient.invalidateQueries(["friendsRequests"]);
		queryClient.invalidateQueries(["blockedUsers"]);
	} else {
		queryClient.invalidateQueries(["friendStatus", id]);
	}
};

export const removeFriendRequestFromQuery = (
	queryClient: QueryClient,
	id: string,
	type: FriendRequestType = FriendRequestType.Received
) => {
	queryClient.setQueryData(
		["friendsRequests"],
		(oldData: FriendRequestQueryResponse | undefined) => {
			if (!(oldData && oldData[type])) return oldData;
			return {
				...oldData,
				[type]: oldData[type].filter(
					(user: FriendRequest) => user.id !== id
				),
			};
		}
	);
};

export const removeFriendFromQuery = (
	queryClient: QueryClient,
	id: string,
	FriendUserid: string
) => {
	queryClient.setQueryData(["friends", id], (oldData: User[] | undefined) => {
		if (!oldData) return oldData;
		return oldData.filter((user: User) => user.id !== FriendUserid);
	});
};

export const removeBlockedUserFromQuery = (
	queryClient: QueryClient,
	id: string
) => {
	queryClient.setQueryData(
		["blockedUsers"],
		(oldData: User[] | undefined) => {
			if (!oldData) return oldData;
			return oldData.filter((user: User) => user.id !== id);
		}
	);
};

export const updateUserStatusFromQuery = (
	queryClient: QueryClient,
	id: string,
	connectedUserId: string,
	status: UserStatus
) => {
	queryClient.setQueryData(["profile", id], (oldData: User | undefined) => {
		if (!oldData) return oldData;
		return {
			...oldData,
			status,
		};
	});

	console.log("FOFOFOF");

	queryClient.setQueryData(
		["friends", connectedUserId],
		(oldData: User[] | undefined) => {
			console.log("COOL0");
			console.log(connectedUserId);
			if (!oldData) return oldData;
			console.log("COOL");

			console.log(oldData);
			const r = oldData.map((user: User) => {
				if (user.id !== id) return user;
				return {
					...user,
					status,
				};
			});
			console.log(r);
			return r;
		}
	);
};
