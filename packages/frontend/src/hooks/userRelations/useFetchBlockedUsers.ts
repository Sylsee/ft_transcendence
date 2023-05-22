import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchBlockedUsers } from "api/userRelations/userRelationsRequest";
import { ApiErrorResponse } from "types/global/global";
import { User } from "types/user/user";

const useFetchBlockedUsers = (
	isConnectedUser: boolean
): UseQueryResult<User[], ApiErrorResponse> => {
	const query = useQuery<User[], ApiErrorResponse>(
		["blockedUsers"],
		() => fetchBlockedUsers(),
		{
			enabled: isConnectedUser,
		}
	);
	return query;
};

export { useFetchBlockedUsers };
