import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import React from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { emitLobbySocketEvent } from "sockets/socket";
import { setIsLobbyOwner, setLobbyStatus } from "store/game-slice/game-slice";
import { LobbySendEvent, LobbyState } from "types/game/lobby";

interface LobbyStartProps {
	gameSocket: Socket;
}

const LobbyStart: React.FC<LobbyStartProps> = ({ gameSocket }) => {
	const dispatch = useDispatch();

	const handleQueueClick = () => {
		emitLobbySocketEvent(LobbySendEvent.Search);
		dispatch(setLobbyStatus(LobbyState.Searching));
	};

	const handleLobbyClick = () => {
		emitLobbySocketEvent(LobbySendEvent.CreateLobby);
		dispatch(setIsLobbyOwner(true));
	};

	return (
		<div className="w-full max-w-4xl flex flex-col justify-center  ">
			<div className="mb-4">
				<div className="text-xl font-bold text-center">
					<h1>
						Step into the Pong arena and challenge players from
						around the globe!
					</h1>
				</div>
			</div>
			<div className="flex flex-col md:flex-row text-lg">
				<div className="flex justify-center items-center h-64 w-full">
					<UserRowButton
						color="silver-tree"
						name="Create a lobby"
						handleClick={handleLobbyClick}
					/>
				</div>
				<div className="w-full flex justify-center">
					<div className="w-full md:w-1 max-w-[80%] h-1 md:h-full bg-mirage-950"></div>
				</div>
				<div className="flex justify-center items-center h-64 w-full ">
					<UserRowButton
						color="astronaut"
						name="Join queue"
						handleClick={handleQueueClick}
					/>
				</div>
			</div>
		</div>
	);
};

export { LobbyStart };
