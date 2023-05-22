import {
	faArrowRightToBracket,
	faArrowUpFromBracket,
	faBan,
	faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { UserRelationCardButton } from "components/Profile/UserRelationCard/UserRelationCardHeader/UserRelationCardButton/UserRelationCardButton";
import React from "react";
import { UserListType } from "types/userRelations/userRelations";

interface UserRelationCardHeaderProps {
	isConnectedUser: boolean;
	userListType: UserListType;
	setUserListType: React.Dispatch<React.SetStateAction<UserListType>>;
}

const UserRelationCardHeader: React.FC<UserRelationCardHeaderProps> = ({
	isConnectedUser,
	setUserListType,
	userListType,
}) => {
	return (
		<div className="flex">
			<UserRelationCardButton
				icon={faUserGroup}
				isActive={userListType === UserListType.FriendList}
				handleClick={() => setUserListType(UserListType.FriendList)}
			/>
			{isConnectedUser && (
				<>
					<UserRelationCardButton
						icon={faArrowRightToBracket}
						rotation={90}
						isActive={
							userListType === UserListType.ReceivedFriendRequests
						}
						handleClick={() =>
							setUserListType(UserListType.ReceivedFriendRequests)
						}
					/>
					<UserRelationCardButton
						icon={faArrowUpFromBracket}
						isActive={
							userListType === UserListType.SentFriendRequests
						}
						handleClick={() =>
							setUserListType(UserListType.SentFriendRequests)
						}
					/>
					<UserRelationCardButton
						icon={faBan}
						isActive={userListType === UserListType.BlockedUsers}
						handleClick={() =>
							setUserListType(UserListType.BlockedUsers)
						}
					/>
				</>
			)}
		</div>
	);
};

export { UserRelationCardHeader };
