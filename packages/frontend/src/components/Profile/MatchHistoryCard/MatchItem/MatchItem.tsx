import { UserMatchBody } from "components/Profile/MatchHistoryCard/MatchItem/UserMatchItem/UserMatchBody/UserMatchBody";
import { UserMatchHeader } from "components/Profile/MatchHistoryCard/MatchItem/UserMatchItem/UserMatchHeader/UserMatchHeader";
import React from "react";
import { Match } from "types/user/user";
import { getGameResult } from "utils/game/getGameResult";

interface MatchItemProps {
	match: Match;
	userId: string;
}

const MatchItem: React.FC<MatchItemProps> = ({ match, userId }) => {
	return (
		<div
			className={`flex flex-col items-center p-2 min-h-20 shadow-xl my-1 bg-mako`}
		>
			{/* header */}
			<UserMatchHeader date={match.createdAt} mode={match.mode} />
			{/* content */}
			<UserMatchBody
				winner={match.winner}
				loser={match.loser}
				winnerPoints={match.winnerPoints}
				loserPoints={match.loserPoints}
				gameResult={getGameResult(userId, match.winner.id)}
			/>
		</div>
	);
};

export { MatchItem };
