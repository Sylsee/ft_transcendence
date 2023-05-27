import React from "react";
import { Link } from "react-router-dom";
import { GameResult } from "types/game/game";
import { User } from "types/user/user";

interface UserMatchBodyProps {
	winner: User;
	loser: User;
	winnerPoints: number;
	loserPoints: number;
	gameResult: GameResult;
}

const UserMatchBody: React.FC<UserMatchBodyProps> = ({
	winner,
	loser,
	winnerPoints,
	loserPoints,
	gameResult,
}) => {
	const gameColor = () => {
		if (gameResult === GameResult.Win) {
			return "bg-silver-tree";
		} else if (gameResult === GameResult.Lose) {
			return "bg-tamarillo-400";
		} else {
			return "bg-mako";
		}
	};

	return (
		<div
			className={`grow flex items-center justify-between h-full w-full p-1 rounded-lg ${gameColor()}`}
		>
			{/* first child */}
			<Link to={`/user/${winner.id}`} className="sm:block">
				<img
					className="w-10 min-w-10 h-10 rounded-full mr-2"
					src={winner.profilePictureUrl}
					alt="The winner"
				/>
			</Link>
			{/* second child */}
			<div className="flex grow">
				<Link
					to={`/user/${winner.id}`}
					className="w-2/5 text-end hidden sm:block"
				>
					<p className="font-bold">{winner.name}</p>
				</Link>
				<div className="font-bold text-gun-powder-200 w-full sm:w-1/5 text-center">
					{winnerPoints} / {loserPoints}
				</div>
				<Link
					to={`/user/${loser.id}`}
					className="w-2/5 hidden sm:block"
				>
					<p className="font-bold break-words">{loser.name}</p>
				</Link>
			</div>
			{/* third child */}
			<Link to={`/user/${loser.id}`} className="sm:block">
				<img
					className="w-10 min-w-10 h-10 rounded-full mr-2"
					src={loser.profilePictureUrl}
					alt="The Loser"
				/>
			</Link>
		</div>
	);
};

export { UserMatchBody };
