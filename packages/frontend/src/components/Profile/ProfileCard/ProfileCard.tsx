import { Profile2faAuth } from "components/Profile/ProfileCard/Profile2faAuth/Profile2faAuth";
import { ProfileAvatar } from "components/Profile/ProfileCard/ProfileAvatar/ProfileAvatar";
import { ProfileName } from "components/Profile/ProfileCard/ProfileName/ProfileName";
import { FriendStatus } from "components/Profile/UserRelationCard/FriendStatus/FriendStatus";
import { useSelector } from "react-redux";
import { RootState } from "types/global/global";
import { User } from "types/user/user";

interface ProfileCardProps {
	user: User;
	isConnectedUser: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, isConnectedUser }) => {
	const isTwoFactorAuthEnabled = useSelector(
		(store: RootState) => store.AUTH.isTwoFactorAuthEnabled
	);

	return (
		<div className="p-6 min-h-[384px] flex flex-col lg:w-1/2 shadow-md rounded-xl bg-tuna">
			<ProfileAvatar
				isConnectedUser={isConnectedUser}
				profilePictureUrl={user.profilePictureUrl}
				status={user.status}
			/>
			<div className="grow flex flex-col items-center text-xl">
				<ProfileName
					isConnectedUser={isConnectedUser}
					id={user.id}
					name={user.name}
				/>
				{isConnectedUser && (
					<Profile2faAuth
						id={user.id}
						isTwoFactorAuthEnabled={isTwoFactorAuthEnabled}
					/>
				)}
			</div>
			{!isConnectedUser && <FriendStatus id={user.id} />}
		</div>
	);
};

export { ProfileCard };
