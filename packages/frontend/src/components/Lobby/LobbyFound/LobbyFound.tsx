import { LobbyFriends } from "components/Lobby/LobbyFound/LobbyFriends/LobbyFriends";
import { LobbyLeave } from "components/Lobby/LobbyFound/LobbyLeave/LobbyLeave";
import { LobbyUserCard } from "components/Lobby/LobbyFound/LobbyUserCard/LobbyUserCard";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "types/global/global";

interface LobbyFoundProps {}

const LobbyFound: React.FC<LobbyFoundProps> = ({}) => {
	const connectedUserId = useSelector(
		(state: RootState) => state.USER.user?.id
	);
	const lobby = useSelector((state: RootState) => state.GAME.lobby);
	const isLobbyOwner = useSelector(
		(state: RootState) => state.GAME.isLobbyOwner
	);

	if (!lobby || isLobbyOwner === undefined || !connectedUserId) return null;
	return (
		<div className="w-full max-w-4xl flex flex-col justify-center">
			<div className="m-4 flex flex-col justify-center items-center">
				<p className="text-4xl font-bold text-silver-tree-400">
					{isLobbyOwner ? "Your lobby" : "Lobby Found"}
				</p>
				<p className="text-2xl">
					Game will start when all players are ready.
				</p>
			</div>
			{isLobbyOwner && lobby.players.length < 2 && (
				<LobbyFriends connectedUserId={connectedUserId} />
			)}
			<div className="flex flex-col md:flex-row text-lg">
				{lobby.players.map((player, index) => (
					<LobbyUserCard
						key={index}
						player={player}
						isConnectedUser={connectedUserId === player.id}
					/>
				))}
				<div></div>
			</div>
			<LobbyLeave />
		</div>
	);
};

export { LobbyFound };
