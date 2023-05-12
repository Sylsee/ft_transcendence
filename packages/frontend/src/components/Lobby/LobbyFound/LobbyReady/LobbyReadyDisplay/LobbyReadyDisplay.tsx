import React from "react";

interface LobbyReadyDisplayProps {
	isReady: boolean;
}

const LobbyReadyDisplay: React.FC<LobbyReadyDisplayProps> = ({ isReady }) => {
	if (isReady) {
		return (
			<div className="font-bold py-2 px-4 rounded m-1 text-silver-tree">
				Ready
			</div>
		);
	}
	return (
		<div className="font-bold py-2 px-4 rounded m-1 text-tamarillo-600 ">
			Not Ready
		</div>
	);
};

export { LobbyReadyDisplay };
