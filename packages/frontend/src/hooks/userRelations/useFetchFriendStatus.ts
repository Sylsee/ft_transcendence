import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendStatus } from "api/userRelations/userRelationsRequest";
import { ApiErrorResponse } from "types/global/global";

import { FriendStatusQueryResponse } from "../../types/userRelations/api";

const useFetchFriendStatus = (
	id: string
): UseQueryResult<FriendStatusQueryResponse, ApiErrorResponse> => {
	const query = useQuery<FriendStatusQueryResponse, ApiErrorResponse>(
		["friendStatus", id],
		() => fetchFriendStatus(id)
	);
	return query;
};

export { useFetchFriendStatus };
