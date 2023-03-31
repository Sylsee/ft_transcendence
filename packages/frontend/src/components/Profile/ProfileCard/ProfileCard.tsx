import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";
import { fetchUserById } from "../../../api/user/userRequests";
import { ERROR_MESSAGES } from "../../../config";
import { RootState } from "../../../types/global";
import { Loader } from "../../Loader/Loader";
import { Profile2faAuth } from "./Profile2faAuth/Profile2faAuth";
import { ProfileAvatar } from "./ProfileAvatar/ProfileAvatar";
import { ProfileName } from "./ProfileName/ProfileName";

interface ProfileCardProps {
	id: string | undefined;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ id = "" }) => {
	const connected_user = useSelector((store: RootState) => store.USER.user);
	const isConnectedUser = connected_user !== null && connected_user.id === id;

	const {
		data: profileData,
		error,
		isError,
		isLoading,
	} = useQuery(["profile", id], () => fetchUserById(id), {
		enabled: !isConnectedUser,
		initialData: () => {
			if (isConnectedUser) {
				return connected_user;
			}
			return undefined;
		},
		retry: 1,
	});

	if (isLoading)
		return (
			<div className="mt-10 flex flex-col lg:w-1/2 w-full">
				<Loader />
			</div>
		);

	if (isError) {
		const message =
			error instanceof Error
				? error.message
				: ERROR_MESSAGES.UNKNOWN_ERROR;
		return (
			<div className="mt-10 flex flex-col lg:w-1/2 w-full">
				<p>Error: {message}</p>
			</div>
		);
	}

	return (
		<div className="p-6 flex flex-col lg:w-1/2 border-solid border-2">
			<ProfileAvatar
				id={id}
				isConnectedUser={isConnectedUser}
				avatarUrl={profileData.avatarUrl}
			/>
			<div className="h-1/2 flex flex-col  items-center pt-5">
				<div>
					<ProfileName
						isConnectedUser={isConnectedUser}
						name={profileData.name}
						id={id}
					/>
					<Profile2faAuth />
					<div>
						{profileData && profileData.status && (
							<p>status: {profileData.status}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export { ProfileCard };
