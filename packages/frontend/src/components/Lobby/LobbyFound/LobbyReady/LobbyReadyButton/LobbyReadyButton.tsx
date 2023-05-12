import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import React from "react";
import { emitLobbySocketEvent } from "sockets/socket";
import { LobbySendEvent } from "types/game/lobby";

interface LobbyReadyButtonProps {
	isReady: boolean;
}

const LobbyReadyButton: React.FC<LobbyReadyButtonProps> = ({ isReady }) => {
	const handleReadyClick = () => {
		emitLobbySocketEvent(LobbySendEvent.Ready);
	};

	const handleUnreadyClick = () => {
		emitLobbySocketEvent(LobbySendEvent.Unready);
	};
	if (isReady) {
		return (
			<UserRowButton
				color="silver-tree"
				name="Ready"
				handleClick={handleUnreadyClick}
			/>
		);
	}
	return (
		<UserRowButton
			color="tamarillo"
			name="Not Ready"
			handleClick={handleReadyClick}
		/>
	);
};

export { LobbyReadyButton };
