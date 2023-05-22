import React from "react";
import { Link } from "react-router-dom";
import { User } from "types/user/user";

interface UserMatchItemProps {
	user: User;
	userPoints: number;
}

const UserMatchItem: React.FC<UserMatchItemProps> = ({ user, userPoints }) => {
	return (
		<div className="flex items-center h-8">
			<div className="w-10 mr-2">
				<Link to={`/user/${user.id}`} className="">
					<div>
						<img
							className=" w-10 min-w-10 h-10 rounded-full mr-2"
							src={user.profilePictureUrl}
							alt=""
						/>
					</div>
				</Link>
			</div>
			<div className="flex flex-wrap break-words">
				<span className="font-medium">{user.name}qqqqqqqqq</span>
				{"  "}
				<span className="text-gray-500"> ({userPoints} points)</span>
			</div>
		</div>
	);
};

export { UserMatchItem };
