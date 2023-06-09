import React from "react";

interface UserStatRowProps {
	name: string;
	value: string;
}

const UserStatRow: React.FC<UserStatRowProps> = ({ name, value }) => {
	return (
		<div className="flex flex-col sm:flex-row w-full h-1/3 my-1 rounded-md bg-mako">
			<div className="w-full sm:w-1/2 flex items-center text-silver-tree">
				<div className="text-center sm:text-end w-full">
					<p>{name}</p>
				</div>
			</div>
			<div className="w-full sm:w-1/2 flex items-center">
				<div className="w-full text-center text-athens-gray">
					<p>{value}</p>
				</div>
			</div>
		</div>
	);
};

export { UserStatRow };
