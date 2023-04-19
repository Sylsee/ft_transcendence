import {
	faCheck,
	faPenToSquare,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { ERROR_MESSAGES } from "../../../../config";
import { useUpdateUser } from "../../../../hooks/user/useUpdateUser";
import { Loader } from "../../../Loader/Loader";

interface ProfileNameProps {
	id: string;
	isConnectedUser: boolean;
	name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({
	id,
	isConnectedUser = false,
	name,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const mutation = useUpdateUser(id);

	const editButton = () => {
		setIsEditing(true);
	};

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing, inputRef]);

	const cancelButton = () => {
		setIsEditing(false);
	};

	const submitButton = (e: any) => {
		e.preventDefault();
		if (inputRef.current) {
			if (inputRef.current.value.trim() !== name)
				mutation.mutate({ name: inputRef.current.value });
			if (!mutation.error) setIsEditing(false);
		}
	};

	return (
		<div className="flex ">
			{isConnectedUser && isEditing ? (
				<div className="flex flex-col">
					<div className="flex items-center h-[40px]">
						<form onSubmit={submitButton}>
							<input
								ref={inputRef}
								name="name"
								className="bg-transparent border-solid border-2 "
								style={{
									padding: "",
								}}
								defaultValue={name}
							/>
							{mutation.isLoading ? (
								<Loader />
							) : (
								<button type="submit" className="ml-4">
									<FontAwesomeIcon
										fixedWidth
										icon={faCheck}
									/>
								</button>
							)}
						</form>
						<button className="ml-4">
							<FontAwesomeIcon
								fixedWidth
								icon={faXmark}
								onClick={cancelButton}
							/>
						</button>
					</div>
					{mutation.error ? (
						<div>
							<p className="text-red-500">
								{mutation.error instanceof Error
									? mutation.error.message
									: ERROR_MESSAGES.UNKNOWN_ERROR}
							</p>
						</div>
					) : null}
				</div>
			) : (
				<div className="flex items-center h-[40px]">
					<div className="">
						<p>name: </p>
					</div>
					<div className="ml-4">
						<p>{name}</p>
					</div>
					{isConnectedUser && (
						<button className="ml-4" onClick={editButton}>
							<FontAwesomeIcon fixedWidth icon={faPenToSquare} />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export { ProfileName };
