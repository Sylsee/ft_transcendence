import { UserMatchHeader } from "components/Profile/MatchHistoryCard/MatchItem/UserMatchItem/UserMatchHeader/UserMatchHeader";
import React from "react";
import { Link } from "react-router-dom";
import { Match } from "types/user/user";

interface MatchItemProps {
	match: Match;
	userId: string;
}

const MatchItem: React.FC<MatchItemProps> = ({ match, userId }) => {
	return (
		<div
			className={`flex flex-col items-center p-2 min-h-20 shadow-xl my-1 bg-fiord`}
		>
			{/* header */}
			<UserMatchHeader date={match.createdAt} mode={match.mode} />
			{/* content */}
			<div
				className={`grow flex items-center justify-between h-full w-full p-1 rounded-lg ${
					userId === match.winner.id
						? "bg-silver-tree"
						: "bg-tamarillo-400"
				} `}
			>
				{/* first child */}
				<Link to={`/user/${match.winner.id}`} className="sm:block">
					<img
						className="w-10 min-w-10 h-10 rounded-full mr-2"
						src={match.winner.profilePictureUrl}
						alt="The winner"
					/>
				</Link>
				{/* second child */}
				<div className="flex grow">
					<Link
						to={`/user/${match.winner.id}`}
						className="w-2/5 text-end hidden sm:block"
					>
						<p className="font-bold">{match.winner.name}</p>
					</Link>
					<div className="font-bold text-oxford-blue-700 w-full sm:w-1/5 text-center">
						{match.winnerPoints} / {match.loserPoints}
					</div>
					<Link
						to={`/user/${match.loser.id}`}
						className="w-2/5 hidden sm:block"
					>
						<p className="font-bold break-words">
							{match.loser.name}
						</p>
					</Link>
				</div>
				{/* third child */}
				<Link to={`/user/${match.loser.id}`} className="sm:block">
					<img
						className="w-10 min-w-10 h-10 rounded-full mr-2"
						src={match.loser.profilePictureUrl}
						alt="The Loser"
					/>
				</Link>
			</div>
		</div>
	);
};

export { MatchItem };
