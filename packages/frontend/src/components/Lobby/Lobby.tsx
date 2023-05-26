import { Game } from "components/Game/Game";
import { LobbyFound } from "components/Lobby/LobbyFound/LobbyFound";
import { LobbySearchGame } from "components/Lobby/LobbySearchGame/LobbySearchGame";
import { LobbyStart } from "components/Lobby/LobbyStart/LobbyStart";
import React from "react";
import { useSelector } from "react-redux";
import { getGameSocket } from "sockets/socket";
import { LobbyState } from "types/game/lobby";
import { RootState } from "types/global/global";

interface LobbyProps {}

const Lobby: React.FC<LobbyProps> = () => {
	const LobbyStatus = useSelector(
		(state: RootState) => state.GAME.lobbyStatus
	);

	const gameSocket = getGameSocket();

	if (!gameSocket) return null;

	return (
		<div className="w-full text-white p-4 overflow-auto border-2 min-h-full ">
			<div className="w-full min-h-full inline-flex flex-col justify-center items-center">
				<div className="max-w-7xl inline-flex flex-col justify-center items-center w-full">
					{LobbyStatus === LobbyState.Idle && (
						<LobbyStart gameSocket={gameSocket} />
					)}
					{LobbyStatus === LobbyState.Searching && (
						<LobbySearchGame gameSocket={gameSocket} />
					)}
					{LobbyStatus === LobbyState.Found && <LobbyFound />}
					{(LobbyStatus === LobbyState.Start ||
						LobbyStatus === LobbyState.Finish) && <Game />}
					{/* {LobbyStatus === LobbyState.Finish && <ScoreBoard />} */}
				</div>
			</div>
		</div>
	);
};

export { Lobby };
