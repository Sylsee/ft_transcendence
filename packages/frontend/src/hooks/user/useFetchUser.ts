import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchUserById } from "api/user/userRequests";
import { User } from "types/user/user";

const useFetchUser = (
	id: string | undefined,
	isConnectedUser: boolean
): UseQueryResult<User, Error> => {
	const query = useQuery<User, Error>(
		["profile", id],
		() => {
			if (!id) throw new Error("No id provided");
			return fetchUserById(id);
		},
		{
			enabled: !isConnectedUser,
			retry: 1,
		}
	);

	return query;
};

export { useFetchUser };
