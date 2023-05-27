import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchUserMatchStats } from "api/user/userRequests";
import { ApiErrorResponse } from "types/global/global";
import { UserStats } from "types/user/user";

const useFetchMatchStats = (
	id: string
): UseQueryResult<UserStats, ApiErrorResponse> => {
	const query = useQuery<UserStats, ApiErrorResponse>(
		["matchStats", id],
		() => fetchUserMatchStats(id)
	);
	return query;
};

export { useFetchMatchStats };
