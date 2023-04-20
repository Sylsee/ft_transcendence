import { FriendRow } from "../FriendRow/FriendRow";

interface FriendsRequestsProps {
	id: string;
	isConnectedUser: boolean;
}

const FriendsRequests: React.FC<FriendsRequestsProps> = ({
	id,
	isConnectedUser = false,
}) => {
	// const {
	// 	data: friendRequests,
	// 	isLoading: isLoadingFriendRequests,
	// 	error: friendRequestsError,
	// } = useQuery(["friendRequests", id], () => fetchFriendsRequests(id), {
	// 	enabled: isConnectedUser,
	// 	onSettled(data, error) {
	// 		console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");
	// 		console.log(data, error);
	// 	},
	// });

	return (
		<div className="border-solid border-2 mb-7 flex flex-col">
			<div className="flex flex-col items-center h-[3rem] justify-center">
				<div>
					<p>Friends Requests</p>
				</div>
			</div>
			<div className="flex flex-col max-h-32 overflow-y-auto">
				<FriendRow name="jean" onClick={() => {}} isFriends={false} />
			</div>
		</div>
	);
};

export { FriendsRequests };
