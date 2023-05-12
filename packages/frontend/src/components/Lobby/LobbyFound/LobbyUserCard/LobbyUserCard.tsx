import { LobbyReady } from "components/Lobby/LobbyFound/LobbyReady/LobbyReady";
import React from "react";
import { Link } from "react-router-dom";
import { LobbyUser } from "types/game/lobby";

interface LobbyUserCardProps {
	player: LobbyUser;
	isConnectedUser: boolean;
}

const LobbyUserCard: React.FC<LobbyUserCardProps> = ({
	player,
	isConnectedUser,
}) => {
	return (
		<div className="flex flex-col h-96 p-4 items-stretch w-full">
			<div className="sm:m-2 md:m-4 p-4 h-full bg-astronaut-950 rounded-lg shadow-lg">
				<div className="flex justify-center items-center">
					<Link to={`/user/${player.id}`}>
						<img
							src={player.profilePictureUrl}
							className="object-cover rounded-full border-solid border-white border-2 w-32 h-32"
							alt={`${player.name} avatar`}
						/>
					</Link>
				</div>
				<div className="flex justify-center mt-4 ">
					<p>{player.name}</p>
				</div>
				<LobbyReady
					isReady={player.isReady}
					isConnectedUser={isConnectedUser}
				/>
			</div>
		</div>
	);
};

export { LobbyUserCard };
