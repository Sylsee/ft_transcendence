import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useUpdateUser } from "../../../../hooks/user/useUpdateUser";
import { UserStatus } from "../../../../types/user";

interface ProfileAvatarProps {
	id: string;
	isConnectedUser: boolean;
	avatarUrl: string;
	status: UserStatus | undefined;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
	id,
	isConnectedUser,
	avatarUrl,
	status,
}) => {
	const [hover, setHover] = useState<boolean>(false);
	const mutation = useUpdateUser(id);

	const handleUpload = (e: any) => {
		const file = e.target.files?.[0];
		if (file) {
			mutation.mutate({ avatar: file });
		}
	};

	return (
		<div className="relative w-32 h-32 mx-auto">
			<div className="relative">
				<img
					src={avatarUrl}
					referrerPolicy="no-referrer"
					alt="Avatar"
					className="w-full h-full object-cover rounded-full border-solid border-white border-2"
				/>
				<span
					className={`bottom-1 right-6 absolute w-3.5 h-3.5 ${
						status === UserStatus.Online
							? "bg-green-400"
							: "bg-gray-500"
					} border-2 border-white dark:border-gray-800 rounded-full`}
				></span>
			</div>
			{isConnectedUser && (
				<div
					className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-300 ${
						hover ? "bg-gray-500 bg-opacity-50" : "opacity-0"
					}`}
				>
					<label htmlFor="file-upload" className="cursor-pointer">
						<FontAwesomeIcon
							icon={faCamera}
							className="text-white"
						/>
					</label>
					<input
						type="file"
						id="file-upload"
						className="opacity-0 w-full absolute h-full rounded-full cursor-pointer"
						onChange={handleUpload}
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
						accept="image/*"
					/>
				</div>
			)}
		</div>
	);
};

export { ProfileAvatar };
