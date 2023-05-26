import { EllipsisLoadingText } from "components/Loader/EllipsisLoadingText/EllipsisLoadingText";
import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import React from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { emitLobbySocketEvent } from "sockets/socket";
import { setLobbyStatus } from "store/game-slice/game-slice";
import { LobbySendEvent, LobbyState } from "types/game/lobby";

interface LobbySearchGameProps {
	gameSocket: Socket;
}

const LobbySearchGame: React.FC<LobbySearchGameProps> = ({ gameSocket }) => {
	const dispatch = useDispatch();

	const handleCancelClick = () => {
		emitLobbySocketEvent(LobbySendEvent.CancelSearchGame);
		dispatch(setLobbyStatus(LobbyState.Idle));
	};

	return (
		<div className="flex flex-col justify-center  ">
			<div className="">
				<div className="text-xl font-bold text-center mb-4">
					<EllipsisLoadingText content="Waiting for a match" />
				</div>
				<div className="flex justify-center items-center w-full text-lg">
					<UserRowButton
						color="astronaut"
						name="Cancel"
						handleClick={handleCancelClick}
					/>
				</div>
			</div>
		</div>
	);
};

export { LobbySearchGame };
