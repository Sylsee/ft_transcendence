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
		<div className=" flex flex-col items-center">
			<div className="w-full max-w-3xl">
				<UserList
					users={friends}
					status={status}
					error={error}
					type={UserListType.InviteToLobby}
				/>
				<div className="text-center">
					<p>
						You can invite other players by using the{" "}
						<span className="font-bold bg-mako p-1 rounded-md text-athens-gray">
							/invite
						</span>{" "}
						command in the chat.
					</p>
				</div>
			</div>
		</div>
	);
};

export { LobbyFriends };
