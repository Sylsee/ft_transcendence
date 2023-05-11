import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriends } from "api/userRelations/userRelationsRequest";
import { ApiErrorResponse } from "types/global/global";
import { User } from "types/user/user";

const useFetchFriends = (
	id: string
): UseQueryResult<User[], ApiErrorResponse> => {
	const query = useQuery<User[], ApiErrorResponse>(["friends", id], () =>
		fetchFriends(id)
	);
	return query;
};

export { useFetchFriends };
