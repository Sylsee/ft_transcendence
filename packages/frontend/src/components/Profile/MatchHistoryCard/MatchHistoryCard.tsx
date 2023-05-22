import { MatchItem } from "components/Profile/MatchHistoryCard/MatchItem/MatchItem";
import { useFetchMatchHistory } from "hooks/user/useFetchMatchHistory";
import React from "react";

interface MatchHistoryCardProps {
	id: string;
}

const MatchHistoryCard: React.FC<MatchHistoryCardProps> = ({ id }) => {
	const { data } = useFetchMatchHistory(id);

	if (!data) return null;

	return (
		<div className="">
			<div className="flex flex-col">
				{/* <div className="flex flex-wrap text-left text-sm font-light bg-backgroundColor sticky top-0">
					<div className="w-full sm:w-1/2 md:w-1/4 py-4 ">Datee</div>
					<div className="w-full sm:w-1/2 md:w-1/4 py-4 ">
						MatchType
					</div>
					<div className="w-full sm:w-1/2 md:w-1/4 py-4 ">Winner</div>
					<div className="w-full sm:w-1/2 md:w-1/4 py-4 ">Loser</div>
				</div> */}
				<div className="flex flex-col items-stretch max-h-64 overflow-auto border-2 border-green-500">
					{data.map((match) => (
						<MatchItem key={match.id} match={match} />
					))}
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div className="w-full overflow-x-auto border-2 border-red-400">
	// 		<div className="max-h-96 block overflow-y-auto">
	// 			<table className="min-w-0 w-full text-left text-sm font-light">
	// 				<thead className="border-b font-medium dark:border-neutral-500 sticky top-0 bg-backgroundColor">
	// 					<tr>
	// 						<th scope="col" className="px-6 py-4 min-w-0">
	// 							Datee
	// 						</th>
	// 						<th scope="col" className="px-6 py-4 min-w-0">
	// 							MatchType
	// 						</th>
	// 						<th scope="col" className="px-6 py-4 min-w-0">
	// 							Winner
	// 						</th>
	// 						<th scope="col" className="px-6 py-4 min-w-0">
	// 							Loser
	// 						</th>
	// 					</tr>
	// 				</thead>
	// 				<tbody className="">
	// 					{/* {data.map((match) => (
	// 						<MatchItem key={match.id} match={match} />
	// 					))} */}
	// 				</tbody>
	// 			</table>
	// 		</div>
	// 	</div>
	// );
};

export { MatchHistoryCard };
