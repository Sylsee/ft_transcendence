import React from "react";
import { formatDate } from "utils/formatter/date";

interface UserMatchHeaderProps {
	date: Date;
	mode: string;
}

const UserMatchHeader: React.FC<UserMatchHeaderProps> = ({ date, mode }) => {
	return (
		<div className="font-medium text-gray-400 flex w-full justify-center p-1">
			<div className="w-1/2 ">
				<p className="mr-2 text-end">{formatDate(date)}</p>
			</div>
			<div className="w-1/2">
				<p>
					<span className="font-bold">type:</span> {mode}
				</p>
			</div>
		</div>
	);
};

export { UserMatchHeader };
