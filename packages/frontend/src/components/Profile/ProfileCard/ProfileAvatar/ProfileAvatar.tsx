import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserById } from "../../../../api/user/userRequests";
import { setUser } from "../../../../store/selfUser-slice/selfUser-slice";

interface ProfileAvatarProps {
	id: string;
	isConnectedUser: boolean;
	avatarUrl: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
	id,
	isConnectedUser,
	avatarUrl,
}) => {
	const [hover, setHover] = useState<boolean>(false);
	const dispatch = useDispatch();

	const mutation = useMutation(
		(newAvatarFile: File) => updateUserById(id, { avatar: newAvatarFile }),
		{
			onSuccess: (user) => {
				dispatch(setUser(user));
			},
			onError: (error) => {},
		}
	);

	const handleUpload = (e: any) => {
		const file = e.target.files?.[0];
		if (file) {
			console.log(file);
			mutation.mutate(file);
		}
	};

	return (
		<div
			className="relative w-32 h-32 mx-auto"
			onMouseEnter={() => {
				console.log("FDP");
				setHover(true);
			}}
			onMouseLeave={() => setHover(false)}
		>
			<img
				src={avatarUrl}
				alt="Avatar"
				className="w-full h-full object-cover rounded-full border-solid border-white border-2"
			/>
			{isConnectedUser && (
				<div
					onMouseEnter={() => {
						console.log("FDP");
						setHover(true);
					}}
					onMouseLeave={() => setHover(false)}
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
						className="opacity-0 w-full h-full absolute"
						onChange={handleUpload}
						accept="image/*"
					/>
				</div>
			)}
		</div>
	);
};

export { ProfileAvatar };
