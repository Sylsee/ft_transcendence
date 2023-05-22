import { UserMatchItem } from "components/Profile/MatchHistoryCard/MatchItem/UserMatchItem/UserMatchItem";
import React from "react";
import { Match } from "types/user/user";
import { formatDate } from "utils/formatter/date";

interface MatchItemProps {
	match: Match;
}

const MatchItem: React.FC<MatchItemProps> = ({ match }) => {
	return (
		// <div className="flex flex-wrap justify-between border-t border-gray-200 py-2">
		// 	<div className="w-full sm:w-auto">
		// 		<span className="text-gray-500">Date: </span>
		// 		{formatDate(match.createdAt)}
		// 	</div>
		// 	<div className="w-full sm:w-auto mt-2 sm:mt-0">
		// 		<span className="text-gray-500">Mode: </span>
		// 		{match.mode}
		// 	</div>
		// 	<div className="w-full sm:w-auto mt-2 sm:mt-0">
		// 		<span className="text-gray-500">Winner: </span>
		// 		{match.winner.name} ({match.winnerPoints} points)
		// 	</div>
		// 	<div className="w-full sm:w-auto mt-2 sm:mt-0">
		// 		<span className="text-gray-500">Loser: </span>
		// 		{match.loser.name} ({match.loserPoints} points)
		// 	</div>
		// </div>
		// <tr className="border-b dark:border-neutral-500">
		// 	<td className="whitespace-nowrap px-6 py-4 font-medium">
		// 		{formatDate(match.createdAt)}
		// 	</td>
		// 	<td className="whitespace-nowrap px-6 py-4">{match.mode}</td>
		// 	<td className="whitespace-nowrap px-6 py-4">
		// 		<UserMatchItem
		// 			user={match.winner}
		// 			userPoints={match.winnerPoints}
		// 		/>
		// 	</td>
		// 	<td className="whitespace-nowrap px-6 py-4">
		// 		<UserMatchItem
		// 			user={match.loser}
		// 			userPoints={match.loserPoints}
		// 		/>
		// 	</td>
		// </tr>
		<div className=" flex flex-wrap  border-b dark:border-neutral-500 border-2 border-red-500">
			<div className="whitespace-nowrap  py-4 font-mediu border-2 w-full pl-2">
				{formatDate(match.createdAt)}
			</div>
			<div className="whitespace-nowrap py-4 border-2 w-full pl-2">
				{match.mode}
			</div>
			<div className="whitespace-nowrap py-4 border-2 w-full pl-2">
				<UserMatchItem
					user={match.winner}
					userPoints={match.winnerPoints}
				/>
			</div>
			<div className="whitespace-nowrap  py-4 border-2 w-full pl-2">
				<UserMatchItem
					user={match.loser}
					userPoints={match.loserPoints}
				/>
			</div>
		</div>
	);
};

export { MatchItem };
