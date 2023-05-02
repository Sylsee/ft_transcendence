import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendRequests } from "api/userRelations/userRelationsRequest";
import { ApiErrorResponse } from "types/global/global";
import { FriendRequestQueryResponse } from "types/user/user";

const useFetchFriendsRequests = (
	isConnectedUser: boolean
): UseQueryResult<FriendRequestQueryResponse, ApiErrorResponse> => {
	const query = useQuery<FriendRequestQueryResponse, ApiErrorResponse>(
		["friendsRequests"],
		() => fetchFriendRequests(),
		{
			enabled: isConnectedUser,
		}
	);

	return query;
};

export { useFetchFriendsRequests };
