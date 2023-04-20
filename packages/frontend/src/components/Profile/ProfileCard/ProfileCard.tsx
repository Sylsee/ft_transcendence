import React from "react";
import { User } from "../../../types/user";
import { Profile2faAuth } from "./Profile2faAuth/Profile2faAuth";
import { ProfileAvatar } from "./ProfileAvatar/ProfileAvatar";
import { ProfileName } from "./ProfileName/ProfileName";

interface ProfileCardProps {
	user: User;
	isConnectedUser: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, isConnectedUser }) => {
	return (
		<div className="p-6 flex flex-col lg:w-1/2 border-solid border-2">
			<ProfileAvatar
				isConnectedUser={isConnectedUser}
				id={user.id}
				avatarUrl={user.avatarUrl}
				status={user.status}
			/>
			<div className="h-1/2 flex flex-col  items-center pt-5">
				<div>
					<ProfileName
						isConnectedUser={isConnectedUser}
						id={user.id}
						name={user.name}
					/>
				</div>
				{isConnectedUser &&
					user.isTwoFactorAuthEnabled !== undefined && (
						<Profile2faAuth
							id={user.id}
							twoFactorAuth={user.isTwoFactorAuthEnabled}
						/>
					)}
			</div>
		</div>
	);
};

export { ProfileCard };
