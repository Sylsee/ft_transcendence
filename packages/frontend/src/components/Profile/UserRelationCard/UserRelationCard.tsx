import { FriendStatus } from "components/Profile/UserRelationCard/FriendStatus/FriendStatus";
import { UserList } from "components/Profile/UserRelationCard/UserList/UserList";
import { useFetchBlockedUsers } from "hooks/userRelations/useFetchBlockedUsers";
import { useFetchFriends } from "hooks/userRelations/useFetchFriends";
import { useFetchFriendsRequests } from "hooks/userRelations/useFetchFriendsRequests";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { UserListType } from "../../../types/userRelations/userRelations";

interface UserRelationCardProps {
	id: string;
	isConnectedUser: boolean;
}

const UserRelationCard: React.FC<UserRelationCardProps> = ({
	id,
	isConnectedUser,
}) => {
	// react-router
	const location = useLocation();

	// custom hooks for fetching data
	const {
		data: FriendsListData,
		status: FriendsListStatus,
		error: FriendsListError,
		refetch: refetchFriendsList,
	} = useFetchFriends(id);

	const {
		data: FriendsRequestsData,
		status: FriendsRequestsStatus,
		error: FriendsRequestsError,
		refetch: refetchFriendsRequests,
	} = useFetchFriendsRequests(isConnectedUser);

	const {
		data: BlockedUsersData,
		status: BlockedUsersStatus,
		error: BlockedUsersError,
		refetch: refetchBlockedUsers,
	} = useFetchBlockedUsers();

	// hooks
	useEffect(() => {
		refetchFriendsList();
		refetchFriendsRequests();
		refetchBlockedUsers();
	}, [
		location,
		refetchBlockedUsers,
		refetchFriendsList,
		refetchFriendsRequests,
	]);

	return (
		<div className="flex flex-col w-full">
			{!isConnectedUser && <FriendStatus id={id} />}
			<UserList
				type={UserListType.FriendList}
				isConnectedUser={isConnectedUser}
				status={FriendsListStatus}
				error={FriendsListError}
				users={FriendsListData}
			/>
			{isConnectedUser && (
				<UserList
					type={UserListType.ReceivedFriendRequests}
					status={FriendsRequestsStatus}
					error={FriendsRequestsError}
					users={FriendsRequestsData?.received}
				/>
			)}
			{isConnectedUser && (
				<UserList
					type={UserListType.SentFriendRequests}
					status={FriendsRequestsStatus}
					error={FriendsRequestsError}
					users={FriendsRequestsData?.sent}
				/>
			)}
			{isConnectedUser && (
				<UserList
					type={UserListType.BlockedUsers}
					status={BlockedUsersStatus}
					error={BlockedUsersError}
					users={BlockedUsersData}
				/>
			)}
		</div>
	);
};

export { UserRelationCard };
