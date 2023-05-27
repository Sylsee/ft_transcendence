import { ErrorItem } from "components/Error/ErrorItem";
import { UserStatRow } from "components/Profile/UserStatsCard/UserStatRow/UserStatRow";
import { useFetchMatchStats } from "hooks/user/useFetchMatchStats";
import React from "react";
interface UserStatCardProps {
	id: string;
}

const UserStatCard: React.FC<UserStatCardProps> = ({ id }) => {
	const { data, status, error } = useFetchMatchStats(id);

	const winLossRatio = (wins: number, losses: number) => {
		if (losses === 0 && wins === 0) {
			return "N/A";
		} else if (losses === 0) {
			return "∞";
		}
		return `${(wins / losses).toFixed(2)} (${wins}/${losses})`;
	};

	const scoreRatio = (scored: number, against: number) => {
		if (against === 0 && scored === 0) {
			return "N/A";
		} else if (against === 0) {
			return "∞";
		}
		return `${(scored / against).toFixed(2)} (${scored}/${against})`;
	};

	if (!data) return null;
	return (
		<div className="flex flex-col h-96 rounded-lg shadow-md p-2 w-full lg:w-1/2 mt-4 bg-tuna">
			<div className="flex justify-center items-center mb-4 text-left font-bold text-lg ">
				<div className="">
					<p>Stats</p>
				</div>
			</div>
			<div className="flex flex-col grow text-3xl font-bold">
				{status === "error" && <ErrorItem error={error} />}
				<UserStatRow
					name="Games Played"
					value={`${data.totalMatches}`}
				/>
				<UserStatRow
					name="Win/Loss Ratio"
					value={winLossRatio(data.wins, data.losses)}
				/>
				<UserStatRow
					name="Score Ratio"
					value={scoreRatio(data.pointsScored, data.pointsAgainst)}
				/>
			</div>
		</div>
	);
};

export { UserStatCard };
