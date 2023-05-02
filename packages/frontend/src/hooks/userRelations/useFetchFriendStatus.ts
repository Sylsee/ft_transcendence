import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchFriendStatus } from "api/userRelations/userRelationsRequest";
import { useDispatch } from "react-redux";
import { stopLoading } from "store/userRelation-slice/userRelation-slice";
import { ApiErrorResponse } from "types/global/global";
import { FriendStatusQueryResponse } from "types/user/user";

const useFetchFriendStatus = (
	id: string
): UseQueryResult<FriendStatusQueryResponse, ApiErrorResponse> => {
	const dispatch = useDispatch();

	const query = useQuery<FriendStatusQueryResponse, ApiErrorResponse>(
		["friendStatus", id],
		() => fetchFriendStatus(id),
		{
			onSettled: () => {
				dispatch(stopLoading(id));
				console.log("friend status fetched");
			},
		}
	);
	return query;
};

export { useFetchFriendStatus };
