import { ErrorItem } from "components/Error/ErrorItem";
import { Loader } from "components/Loader/Loader";
import { MatchItem } from "components/Profile/MatchHistoryCard/MatchItem/MatchItem";
import { useFetchMatchHistory } from "hooks/user/useFetchMatchHistory";
import React from "react";

interface MatchHistoryCardProps {
	id: string;
	userId: string;
}

const MatchHistoryCard: React.FC<MatchHistoryCardProps> = ({ id, userId }) => {
	const { data, status, error } = useFetchMatchHistory(id);

	return (
		<div className="flex flex-col mt-4 h-96 rounded-lg shadow-md p-2 w-full lg:w-1/2 lg:ml-4 bg-tuna">
			<div className="flex justify-center items-center mb-4 text-left font-bold text-lg ">
				<div className="">
					<p>Match History</p>
				</div>
			</div>
			<div className="flex grow overflow-auto">
				<div className="grow overflow-auto px-2">
					{status === "loading" && <Loader />}
					{status === "error" && <ErrorItem error={error} />}
					{data?.map((match) => (
						<MatchItem
							key={match.id}
							match={match}
							userId={userId}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export { MatchHistoryCard };
