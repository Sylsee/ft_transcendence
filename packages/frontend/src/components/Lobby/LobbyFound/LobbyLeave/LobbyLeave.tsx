import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import React from "react";
import { useDispatch } from "react-redux";
import { emitLobbySocketEvent } from "sockets/socket";
import { resetGame } from "store/game-slice/game-slice";
import { LobbySendEvent } from "types/game/lobby";

interface LobbyLeaveProps {}

const LobbyLeave: React.FC<LobbyLeaveProps> = ({}) => {
	const dispatch = useDispatch();

	const handleLeaveClick = () => {
		emitLobbySocketEvent(LobbySendEvent.LeaveLobby);
		dispatch(resetGame());
	};

	return (
		<div className="flex justify-center">
			<UserRowButton
				color="tamarillo"
				name="Leave Lobby"
				handleClick={handleLeaveClick}
			/>
		</div>
	);
};

export { LobbyLeave };
