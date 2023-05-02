import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchBlockedUsers } from "api/userRelations/userRelationsRequest";
import { ApiErrorResponse } from "types/global/global";
import { User } from "types/user/user";

const useFetchBlockedUsers = (): UseQueryResult<User[], ApiErrorResponse> => {
	const query = useQuery<User[], ApiErrorResponse>(["blockedUsers"], () =>
		fetchBlockedUsers()
	);
	return query;
};

export { useFetchBlockedUsers };
