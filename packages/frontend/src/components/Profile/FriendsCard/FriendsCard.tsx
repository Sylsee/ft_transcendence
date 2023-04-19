import React from "react";
import { User } from "../../../types/user";
import { FriendsList } from "../Friends/FriendsList/FriendsList";
import { FriendsRequests } from "../Friends/FriendsRequests/FriendsRequests";

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
	return (
		<div className="flex flex-col w-full">
			<FriendsList id={id} isConnectedUser={isConnectedUser} />
			{isConnectedUser && (
				<FriendsRequests id={id} isConnectedUser={isConnectedUser} />
			)}
		</div>
	);
};

export { FriendsCard };
