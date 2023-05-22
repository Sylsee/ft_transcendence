import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { emitLobbySocketEvent } from "sockets/socket";
import { setLobbyStatus } from "store/game-slice/game-slice";
import { LobbySendEvent, LobbyState } from "types/game/lobby";
import { RootState } from "types/global/global";

interface ScoreBoardProps {}

const ScoreBoard: React.FC<ScoreBoardProps> = ({}) => {
	const game = useSelector((state: RootState) => state.GAME.game);
	const dispatch = useDispatch();

	const handleCancelClick = () => {
		emitLobbySocketEvent(LobbySendEvent.LeaveLobby);
		dispatch(setLobbyStatus(LobbyState.Idle));
	};

	if (!game) return null;
	return (
		<div className="border-2 w-full h-full flex flex-col">
			<div className="flex justify-center">
				<h1 className="text-2xl font-bold text-silver-tree">
					ScoreBoard
				</h1>
			</div>
			<div
				className={`transition-all duration-1000 transform scale-0 opacity-0 text-red-500 ${"scale-100 opacity-100 text-green-500"}`}
			>
				Joueur 1 a gagné !!
			</div>
			<div className="flex justify-center border-2 flex-grow">
				<div className="bg-astronaut-950">
					<div className="border-2 p-20">
						<div className="flex justify-center">
							<img
								className="object-cover rounded-full border-solid border-white border-2 w-32 h-32"
								src={game.score.winner?.profilePictureUrl}
								alt="The winner"
							/>
						</div>

						<div className="mt-4">
							<h2>The Winner is: {game.score.winner?.name}</h2>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-center items-center w-full text-lg">
				<UserRowButton
					color="astronaut"
					name="Leave"
					handleClick={handleCancelClick}
				/>
			</div>
		</div>
	);
};

export { ScoreBoard };
