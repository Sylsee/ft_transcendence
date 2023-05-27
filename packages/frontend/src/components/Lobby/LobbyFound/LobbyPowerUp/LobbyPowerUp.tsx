import React from "react";
import { useSelector } from "react-redux";
import { emitGameSocketEvent } from "sockets/socket";
import { GameSendEvent } from "types/game/game";
import { RootState } from "types/global/global";

interface LobbyPowerUpProps {}

const LobbyPowerUp: React.FC<LobbyPowerUpProps> = () => {
	const isPowerUpEnabled = useSelector(
		(state: RootState) => state.GAME.lobby?.isPowerUpEnabled
	);

	const handleToggleChange = () => {
		console.log(!isPowerUpEnabled);
		console.log("handleToggleChange");
		emitGameSocketEvent(GameSendEvent.PowerUp, {
			active: !isPowerUpEnabled,
		});
	};

	return (
		<div className="flex flex-col justify-center items-center my-2 ">
			<div className="mb-2">
				<span className=" font-bold text-xl">Power Up</span>
			</div>
			<div>
				<label className="relative inline-flex items-center mr-5 cursor-pointer">
					<input
						type="checkbox"
						value=""
						className="sr-only peer"
						onChange={handleToggleChange}
						checked={isPowerUpEnabled}
					/>
					<div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700   peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-silver-tree-600"></div>
				</label>
			</div>
		</div>
	);
};

export { LobbyPowerUp };
