import { Game } from "components/Game/Game";
import { LobbyFound } from "components/Lobby/LobbyFound/LobbyFound";
import { LobbySearchGame } from "components/Lobby/LobbySearchGame/LobbySearchGame";
import { LobbyStart } from "components/Lobby/LobbyStart/LobbyStart";
import { ScoreBoard } from "components/ScoreBoard/ScoreBoard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emitLobbySocketEvent, getGameSocket } from "sockets/socket";
import { resetGame } from "store/game-slice/game-slice";
import { LobbySendEvent, LobbyState } from "types/game/lobby";
import { RootState } from "types/global/global";

interface LobbyProps {}

const Lobby: React.FC<LobbyProps> = () => {
	const dispatch = useDispatch();
	const LobbyStatus = useSelector(
		(state: RootState) => state.GAME.lobbyStatus
	);

	const gameSocket = getGameSocket();

	const statusRef = React.useRef(LobbyStatus);
	const dispatchRef = React.useRef(dispatch);

	useEffect(() => {
		statusRef.current = LobbyStatus;
		dispatchRef.current = dispatch;
	}, [LobbyStatus, dispatch]);

	useEffect(() => {
		return () => {
			if (
				statusRef.current === LobbyState.Start ||
				statusRef.current === LobbyState.Finish
			) {
				emitLobbySocketEvent(LobbySendEvent.LeaveLobby);
				dispatchRef.current(resetGame());
			}
		};
	}, []);
	if (!gameSocket) return null;

	if (LobbyStatus === LobbyState.Start) {
		return (
			<div className="h-full w-full p-8">
				<Game />
			</div>
		);
	}
	return (
		<div className="w-full text-white p-4 overflow-auto min-h-full ">
			<div className="w-full min-h-full inline-flex flex-col justify-center items-center">
				<div className="max-w-7xl inline-flex flex-col justify-center items-center w-full">
					{LobbyStatus === LobbyState.Idle && (
						<LobbyStart gameSocket={gameSocket} />
					)}
					{LobbyStatus === LobbyState.Searching && (
						<LobbySearchGame gameSocket={gameSocket} />
					)}
					{LobbyStatus === LobbyState.Found && <LobbyFound />}
					{LobbyStatus === LobbyState.Finish && <ScoreBoard />}
				</div>
			</div>
		</div>
	);
};

export { Lobby };
