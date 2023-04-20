import React from "react";
import { useFetchFriendsList } from "../../../hooks/user/useFetchFriendsList";
import { useFetchFriendsRequests } from "../../../hooks/user/useFetchFriendsRequests";
import { User } from "../../../types/user";
import { FriendsList } from "../Friends/FriendsList/FriendsList";

interface FriendsCardProps {
	id: string;
	connected_user: User;
	isConnectedUser: boolean;
}

const FriendsCard: React.FC<FriendsCardProps> = ({
	id,
	connected_user,
	isConnectedUser,
}) => {
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
				id={id}
				isConnectedUser={isConnectedUser}
				title="Friends"
				status={FriendsListStatus}
				error={FriendsListError}
				data={FriendsListData}
			/>
			{isConnectedUser && (
				<FriendsList
					id={id}
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
