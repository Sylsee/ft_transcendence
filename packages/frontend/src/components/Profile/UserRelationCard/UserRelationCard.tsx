import { UserList } from "components/Profile/UserRelationCard/UserList/UserList";
import { UserRelationCardHeader } from "components/Profile/UserRelationCard/UserRelationCardHeader/UserRelationCardHeader";
import { useFetchBlockedUsers } from "hooks/userRelations/useFetchBlockedUsers";
import { useFetchFriends } from "hooks/userRelations/useFetchFriends";
import { useFetchFriendsRequests } from "hooks/userRelations/useFetchFriendsRequests";
import { useEffect, useState } from "react";
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
	// state
	const [userListType, setUserListType] = useState<UserListType>(
		UserListType.FriendList
	);

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
	} = useFetchBlockedUsers(isConnectedUser);

	// hooks
	useEffect(() => {
		if (isConnectedUser) {
			refetchFriendsRequests();
			refetchBlockedUsers();
		}
		refetchFriendsList();
	}, [
		location,
		refetchBlockedUsers,
		refetchFriendsList,
		refetchFriendsRequests,
	]);

	return (
		<div
			className="flex flex-col w-full h-96 shadow-md rounded-lg p-6"
			style={{ backgroundColor: "#3A425D" }}
		>
			<UserRelationCardHeader
				isConnectedUser={isConnectedUser}
				setUserListType={setUserListType}
				userListType={userListType}
			/>

			{userListType === UserListType.FriendList && (
				<UserList
					type={UserListType.FriendList}
					isConnectedUser={isConnectedUser}
					status={FriendsListStatus}
					error={FriendsListError}
					users={FriendsListData}
				/>
			)}
			{isConnectedUser &&
				userListType === UserListType.ReceivedFriendRequests && (
					<UserList
						type={UserListType.ReceivedFriendRequests}
						status={FriendsRequestsStatus}
						error={FriendsRequestsError}
						users={FriendsRequestsData?.received}
					/>
				)}
			{isConnectedUser &&
				userListType === UserListType.SentFriendRequests && (
					<UserList
						type={UserListType.SentFriendRequests}
						status={FriendsRequestsStatus}
						error={FriendsRequestsError}
						users={FriendsRequestsData?.sent}
					/>
				)}
			{isConnectedUser && userListType === UserListType.BlockedUsers && (
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
