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
		<div className="h-full flex justify-center items-stretch">
			{LobbyStatus === LobbyState.Idle && (
				<LobbyStart gameSocket={gameSocket} />
			)}
			{LobbyStatus === LobbyState.Searching && (
				<LobbySearchGame gameSocket={gameSocket} />
			)}
			{LobbyStatus === LobbyState.Found && <LobbyFound />}
			{LobbyStatus === LobbyState.Start && <Game />}
			{LobbyStatus === LobbyState.Finish && <div>Finish</div>}
		</div>
	);
};

export { Lobby };
