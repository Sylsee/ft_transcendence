import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchUserById } from "../../../api/user/userRequests";
import { ERROR_MESSAGES } from "../../../config";
import { User } from "../../../types/user";
import { Loader } from "../../Loader/Loader";
import { Profile2faAuth } from "./Profile2faAuth/Profile2faAuth";
import { ProfileAvatar } from "./ProfileAvatar/ProfileAvatar";
import { ProfileName } from "./ProfileName/ProfileName";

interface ProfileCardProps {
	connected_user: User;
	isConnectedUser: boolean;
	id: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
	id,
	connected_user,
	isConnectedUser,
}) => {
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
				isConnectedUser={isConnectedUser}
				id={
					isConnectedUser && connected_user
						? connected_user.id
						: profileData.id
				}
				avatarUrl={
					isConnectedUser && connected_user
						? connected_user.avatarUrl
						: profileData.avatarUrl
				}
				status={
					isConnectedUser && connected_user
						? connected_user.status
						: profileData.status
				}
			/>
			<div className="h-1/2 flex flex-col  items-center pt-5">
				<div>
					<ProfileName
						isConnectedUser={isConnectedUser}
						id={
							isConnectedUser && connected_user
								? connected_user.id
								: profileData.id
						}
						name={
							isConnectedUser && connected_user
								? connected_user.name
								: profileData.name
						}
					/>
				</div>
				{isConnectedUser && connected_user && (
					<Profile2faAuth
						id={connected_user.id}
						twoFactorAuth={false}
					/>
				)}
			</div>
		</div>
	);
};

export { ProfileCard };
