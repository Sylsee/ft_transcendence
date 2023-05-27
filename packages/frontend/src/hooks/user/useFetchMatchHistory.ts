import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchUserMatchHistory } from "api/user/userRequests";
import { ApiErrorResponse } from "types/global/global";
import { Match } from "types/user/user";

const useFetchMatchHistory = (
	id: string
): UseQueryResult<Match[], ApiErrorResponse> => {
	const query = useQuery<Match[], ApiErrorResponse>(
		["matchHistory", id],
		() => fetchUserMatchHistory(id)
	);
	return query;
};

export { useFetchMatchHistory };
