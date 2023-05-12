import { UserList } from "components/Profile/UserRelationCard/UserList/UserList";
import { useFetchFriends } from "hooks/userRelations/useFetchFriends";
import React from "react";
import { UserListType } from "types/userRelations/userRelations";

interface LobbyFriendsProps {
	connectedUserId: string;
}

const LobbyFriends: React.FC<LobbyFriendsProps> = ({ connectedUserId }) => {
	const { data: friends, status, error } = useFetchFriends(connectedUserId);

	return (
		<>
			<UserList
				users={friends}
				status={status}
				error={error}
				type={UserListType.InviteToLobby}
			/>
			<div className="text-center">
				<p>
					You can invite other players by using the{" "}
					<span className="font-bold text-astronaut-200">
						/invite
					</span>{" "}
					command in the chat.
				</p>
			</div>
		</>
	);
};

export { LobbyFriends };
