import { UserRowButton } from "components/Profile/UserRelationCard/UserList/UserRow/Buttons/UserRowButton";
import { UserStatusIcon } from "components/Profile/UserStatusIcon/UserStatusIcon";
import { Link } from "react-router-dom";
import { ButtonPropsList } from "../../../../../types/button/button";
import { FriendRequest } from "../../../../../types/userRelations/userRelations";

interface UserRowProps {
	user: FriendRequest;
	buttonPropsList: ButtonPropsList;
}

const UserRow: React.FC<UserRowProps> = ({ user, buttonPropsList }) => {
	return (
		<div className="flex flex-row flex-wrap items-center justify-between p-2 rounded-md my-1 bg-fiord">
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
						<UserStatusIcon
							status={user.status}
							customStatusStyles={"bottom-0 right-0"}
							customControllerStyles={"bottom-0 right-1"}
						/>
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
