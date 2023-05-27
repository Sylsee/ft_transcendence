import { LobbyReadyButton } from "components/Lobby/LobbyFound/LobbyReady/LobbyReadyButton/LobbyReadyButton";
import { LobbyReadyDisplay } from "components/Lobby/LobbyFound/LobbyReady/LobbyReadyDisplay/LobbyReadyDisplay";
import React from "react";

interface LobbyReadyProps {
	isReady: boolean;
	isConnectedUser: boolean;
}

const LobbyReady: React.FC<LobbyReadyProps> = ({
	isReady,
	isConnectedUser,
}) => {
	return (
		<div className="flex justify-center mt-12">
			{isConnectedUser ? (
				<LobbyReadyButton isReady={isReady} />
			) : (
				<LobbyReadyDisplay isReady={isReady} />
			)}
		</div>
	);
};

export { LobbyReady };
