import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import { Link } from "react-router-dom";
import { ButtonPropsList, FriendRequest, UserStatus } from "types/user/user";

interface UserRowProps {
	user: FriendRequest;
	buttonPropsList: ButtonPropsList;
}

const UserRow: React.FC<UserRowProps> = ({ user, buttonPropsList }) => {
	return (
		<div className="flex flex-row flex-wrap items-center justify-between p-2">
			<div className="flex items-center   flex-grow">
				<Link
					to={`/user/${user.id}`}
					className="relative mr-2 flex items-center"
				>
					<div>
						<img
							className="w-10 min-w-10 h-10 rounded-full"
							src={user.profilePictureUrl}
							alt=""
						/>
						{user.status !== undefined && (
							<div
								className={`absolute bottom-0 right-0 w-3 h-3 ${
									user.status === UserStatus.Active
										? "bg-silver-tree"
										: "bg-gray-500"
								} border-2 border-white rounded-full`}
							></div>
						)}
					</div>
				</Link>
				{/* <div> */}
				<Link to={`/user/${user.id}`} className="max-w-full">
					<div className="break-words">
						<span>{user.name}</span>
					</div>
				</Link>
				{/* </div> */}
			</div>
			<div className="flex justify-center">
				{buttonPropsList.buttons?.map((buttonProps, index) => (
					<UserRowButton
						key={index}
						color={buttonProps.color}
						name={buttonProps.name}
						handleClick={() => buttonProps.handleClick(user.id)}
					/>
				))}
			</div>
		</div>
	);
};

export { UserRow };
