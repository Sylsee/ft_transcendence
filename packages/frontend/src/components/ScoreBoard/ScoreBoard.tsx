import { MatchHistoryCard } from "components/Profile/MatchHistoryCard/MatchHistoryCard";
import { UserMatchBody } from "components/Profile/MatchHistoryCard/MatchItem/UserMatchItem/UserMatchBody/UserMatchBody";
import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import { UserStatCard } from "components/Profile/UserStatsCard/UserStatsCard";
import { GameResultTitle } from "components/ScoreBoard/GameResultTitle/GameResulTitle";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { emitLobbySocketEvent } from "sockets/socket";
import { resetGame } from "store/game-slice/game-slice";
import { LobbySendEvent } from "types/game/lobby";
import { RootState } from "types/global/global";
import { getGameResult } from "utils/game/getGameResult";

interface ScoreBoardProps {}

const ScoreBoard: React.FC<ScoreBoardProps> = () => {
	const game = useSelector((state: RootState) => state.GAME.game);
	const lobby = useSelector((state: RootState) => state.GAME.lobby);
	const connectedUserId = useSelector(
		(state: RootState) => state.USER.user?.id
	);
	const dispatch = useDispatch();

	const handleCancelClick = () => {
		emitLobbySocketEvent(LobbySendEvent.LeaveLobby);
		dispatch(resetGame());
	};

	useEffect(() => {
		if (!game) {
			dispatch(resetGame());
			emitLobbySocketEvent(LobbySendEvent.LeaveLobby);
		}
	}, [game, dispatch]);

	if (!game || !connectedUserId) return null;

	const player1Points = game.isLeftPlayer
		? game.score.player1Score
		: game.score.player2Score;
	const player2Points = game.isLeftPlayer
		? game.score.player2Score
		: game.score.player1Score;

	const gameResult = getGameResult(connectedUserId, game.score.winner?.id);

	if (!lobby?.players || lobby.players.length < 2) return null;
	return (
		<div className="w-full h-full flex flex-col">
			{/* <div className="flex justify-center mb-6 ">
				<h1 className="text-4xl font-bold">ScoreBoard</h1>
			</div> */}
			<div className="flex justify-center flex-grow">
				<div className="p-6 flex flex-col w-full lg:w-1/2 shadow-md rounded-xl bg-tuna">
					<div className="text-center">
						<GameResultTitle gameResult={gameResult} />
					</div>
					{game.score.winner && (
						<div className="flex flex-col justify-center items-center  p-4">
							<Link to={`/user/${game.score.winner.id}`}>
								<img
									src={game.score.winner.profilePictureUrl}
									className="object-cover rounded-full border-solid border-white  w-32 h-32"
									alt={`${game.score.winner.name} avatar`}
								/>
							</Link>
							<div className="flex flex-col justify-center items-center mt-7">
								<Link
									to={`/user/${game.score.winner.id}`}
									className="text-2xl font-bold"
								>
									{game.score.winner.name}
								</Link>
							</div>
						</div>
					)}{" "}
				</div>
			</div>
			<div className="relative bg-tuna rounded-md shadow-md my-2 mt-8">
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gun-powder shadow-md px-2 rounded-xl text-athens-gray p-2 text-xl">
					VS
				</div>
				<div className="flex p-4 pt-6">
					<UserMatchBody
						winner={lobby?.players[0]}
						loser={lobby?.players[1]}
						winnerPoints={player1Points}
						loserPoints={player2Points}
						gameResult={gameResult}
					/>
				</div>
			</div>
			<div className="w-full flex flex-col lg:flex-row">
				<UserStatCard id={connectedUserId} />
				<MatchHistoryCard
					id={connectedUserId}
					userId={connectedUserId}
				/>
			</div>
			<div className="flex justify-center items-center w-full text-lg mt-4">
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
