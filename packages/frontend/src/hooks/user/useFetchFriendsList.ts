import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendsList } from "../../api/friends/friendsRequests";
import { User } from "../../types/user";

const useFetchFriendsList = (id: string): UseQueryResult<User[], Error> => {
	const query = useQuery<User[], Error>(["friendList", id], () =>
		fetchFriendsList(id)
	);

	return query;
};

export { useFetchFriendsList };
