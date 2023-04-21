import React from "react";
import { useFetchFriendsList } from "../../../hooks/user/useFetchFriendsList";
import { useFetchFriendsRequests } from "../../../hooks/user/useFetchFriendsRequests";
import { FriendsList } from "../Friends/FriendsList/FriendsList";

interface FriendsCardProps {
	id: string;
	isConnectedUser: boolean;
}

const FriendsCard: React.FC<FriendsCardProps> = ({ id, isConnectedUser }) => {
	const {
		data: FriendsListData,
		status: FriendsListStatus,
		error: FriendsListError,
	} = useFetchFriendsList(id);

	const {
		data: FriendsRequestsData,
		status: FriendsRequestsStatus,
		error: FriendsRequestsError,
	} = useFetchFriendsRequests(id, isConnectedUser);

	return (
		<div className="flex flex-col w-full">
			<FriendsList
				isConnectedUser={isConnectedUser}
				title="Friends"
				status={FriendsListStatus}
				error={FriendsListError}
				data={FriendsListData}
			/>
			{isConnectedUser && (
				<FriendsList
					isConnectedUser={isConnectedUser}
					title="Friends Requests"
					status={FriendsRequestsStatus}
					error={FriendsRequestsError}
					data={FriendsRequestsData}
				/>
			)}
		</div>
	);
};

export { FriendsCard };
