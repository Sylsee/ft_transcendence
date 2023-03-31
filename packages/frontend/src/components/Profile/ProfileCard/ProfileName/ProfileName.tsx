import {
	faCheck,
	faPenToSquare,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserById } from "../../../../api/user/userRequests";
import { ERROR_MESSAGES } from "../../../../config";
import { setUser } from "../../../../store/selfUser-slice/selfUser-slice";
import { Loader } from "../../../Loader/Loader";

interface ProfileNameProps {
	id: string;
	isConnectedUser: boolean;
	name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({
	id = "",
	isConnectedUser = false,
	name,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();

	const { mutate, isLoading, error } = useMutation(
		(newName: string) => updateUserById(id, { name: newName }),
		{
			onSuccess: (user) => {
				dispatch(setUser(user));
			},
		}
	);

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
			// TODO NEED TO CHECK IF NAME PROPS UPDATE AUTOMATICALLY
			if (inputRef.current.value.trim() !== name)
				mutate(inputRef.current.value);

			if (!error) setIsEditing(false);
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
							{isLoading ? (
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
					{error ? (
						<div>
							<p className="text-red-500">
								{error instanceof Error
									? error.message
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
