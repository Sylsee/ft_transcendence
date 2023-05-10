import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendsList } from "api/friends/friendsRequests";
import { ApiErrorResponse } from "types/global/global";
import { User } from "types/user/user";

const useFetchFriendsList = (
	id: string
): UseQueryResult<User[], ApiErrorResponse> => {
	const query = useQuery<User[], ApiErrorResponse>(["friendList", id], () =>
		fetchFriendsList(id)
	);

	return query;
};

export { useFetchFriendsList };
