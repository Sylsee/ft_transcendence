import { EllipsisLoadingText } from "components/Loader/EllipsisLoadingText/EllipsisLoadingText";
import { LobbyReady } from "components/Lobby/LobbyFound/LobbyReady/LobbyReady";
import React from "react";
import { Link } from "react-router-dom";
import { LobbyUser } from "types/game/lobby";

interface LobbyUserCardProps {
	player?: LobbyUser;
	isConnectedUser?: boolean;
}

const LobbyUserCard: React.FC<LobbyUserCardProps> = ({
	player,
	isConnectedUser,
}) => {
	return (
		<div className="flex flex-col h-96 p-4 items-stretch w-full">
			<div className="sm:m-2 md:m-4 p-4 h-full bg-oxford-blue rounded-lg shadow-lg">
				{player !== undefined && isConnectedUser !== undefined ? (
					<>
						<div className="flex justify-center items-center">
							<Link to={`/user/${player.id}`}>
								<img
									src={player.profilePictureUrl}
									className="object-cover rounded-full border-solid border-white border-2 w-32 h-32"
									alt={`${player.name} avatar`}
								/>
							</Link>
						</div>
						<div className="flex justify-center mt-4 text-2xl">
							<p>{player.name}</p>
						</div>
						<LobbyReady
							isReady={player.isReady}
							isConnectedUser={isConnectedUser}
						/>
					</>
				) : (
					<>
						<div className="flex flex-col justify-center items-center h-full">
							<div className="grow w-full flex flex-col items-center">
								<div className="w-32 h-32 bg-fiord rounded-full animate-pulse"></div>
								<div className="w-1/2 h-10 bg-fiord animate-pulse mt-4 rounded-md"></div>
							</div>
							<div className="min-h-10 p-2 bg-fiord  text-center italic rounded-md">
								<EllipsisLoadingText content="Waiting for the second player to join" />
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export { LobbyUserCard };
