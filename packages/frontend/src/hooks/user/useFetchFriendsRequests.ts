import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendsRequests } from "../../api/friends/friendsRequests";
import { User } from "../../types/user";

const useFetchFriendsRequests = (
	id: string,
	isConnectedUser: boolean
): UseQueryResult<User[], Error> => {
	const query = useQuery<User[], Error>(
		["friendRequests", id],
		() => fetchFriendsRequests(id),
		{
			enabled: isConnectedUser,
		}
	);

	return query;
};

export { useFetchFriendsRequests };
