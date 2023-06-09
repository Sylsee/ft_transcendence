import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserStatusIcon } from "components/Profile/UserStatusIcon/UserStatusIcon";
import { useUploadProfilePicture } from "hooks/user/useUploadProfilePicture";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserStatus } from "types/user/user";

interface ProfileAvatarProps {
	isConnectedUser: boolean;
	profilePictureUrl: string;
	status: UserStatus | undefined;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
	isConnectedUser,
	profilePictureUrl,
	status,
}) => {
	// state
	const [hover, setHover] = useState<boolean>(false);
	const [cacheBusterCounter, setCacheBusterCounter] = useState<number>(0);

	// mutation
	const {
		mutate: uploadMutation,
		status: uploadStatus,
		error: uploadError,
	} = useUploadProfilePicture();

	// handlers
	const handleUpload = (e: any) => {
		const file = e.target.files?.[0];
		if (file) {
			uploadMutation(file);
		}
	};

	useEffect(() => {
		if (uploadStatus === "success") {
			setCacheBusterCounter((prev) => prev + 1);
		} else if (uploadStatus === "error") {
			toast.error(uploadError.message);
		}
	}, [uploadStatus, uploadError]);

	return (
		<div className="relative mx-auto">
			<div className="relative flex items-center">
				<img
					src={`${profilePictureUrl}?cb${cacheBusterCounter}`}
					referrerPolicy="no-referrer"
					alt="Avatar"
					className=" object-cover rounded-full border-solid border-white border-2 w-40 h-40"
				/>
				<UserStatusIcon status={status} />
			</div>
			{isConnectedUser && (
				<div
					className={`absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-300 w-40 h-40 ${
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
