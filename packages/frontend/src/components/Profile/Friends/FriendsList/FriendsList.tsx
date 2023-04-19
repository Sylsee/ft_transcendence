import { useQuery } from "@tanstack/react-query";
import { fetchFriendsList } from "../../../../api/friends/friendsRequests";
import { ERROR_MESSAGES } from "../../../../config";
import { Loader } from "../../../Loader/Loader";

interface FriendsListProps {
	id: string;
	isConnectedUser: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({
	id,
	isConnectedUser = false,
}) => {
	const query = useQuery(["friendsList", id], () => fetchFriendsList(id), {
		onSettled(data, error) {
			console.log("ZZZZ");
			console.log(data, error);
		},
	});

	return (
		<div className="border-solid border-2 mb-7 flex flex-col">
			<div className="flex flex-col items-center h-[3rem] justify-center">
				<div>
					<p>Friends list</p>
				</div>
			</div>
			<div className="flex flex-col max-h-32 overflow-y-auto">
				{query.isLoading && <Loader />}
				{query.isError && (
					<p>
						{query.error instanceof Error
							? query.error.message
							: ERROR_MESSAGES.UNKNOWN_ERROR}
					</p>
				)}
			</div>
		</div>
	);
};

export { FriendsList };
