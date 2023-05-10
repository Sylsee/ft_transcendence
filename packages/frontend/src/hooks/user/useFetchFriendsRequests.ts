import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendsRequests } from "api/friends/friendsRequests";
import { ApiErrorResponse } from "types/global/global";
import { User } from "types/user/user";

const useFetchFriendsRequests = (
	id: string,
	isConnectedUser: boolean
): UseQueryResult<User[], ApiErrorResponse> => {
	const query = useQuery<User[], ApiErrorResponse>(
		["friendRequests", id],
		() => fetchFriendsRequests(id),
		{
			enabled: isConnectedUser,
		}
	);

	return query;
};

export { useFetchFriendsRequests };
