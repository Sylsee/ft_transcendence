import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../../api/user/userRequests";

const useFetchUser = (id: string | undefined, isConnectedUser: boolean) => {
	const query = useQuery(
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
