import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchUserMatchStats } from "api/user/userRequests";

const useFetchMatchStats = (id: string): UseQueryResult<any, Error> => {
	const query = useQuery<any, Error>(["matchStats", id], () =>
		fetchUserMatchStats(id)
	);
	return query;
};

export { useFetchMatchStats };
