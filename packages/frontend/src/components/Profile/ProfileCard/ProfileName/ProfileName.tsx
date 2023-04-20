import {
	faCheck,
	faPenToSquare,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useUpdateUser } from "../../../../hooks/user/useUpdateUser";
import { ErrorItem } from "../../../Error/ErrorItem";
import { Loader } from "../../../Loader/Loader";

interface ProfileNameProps {
	id: string;
	isConnectedUser: boolean;
	name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({
	id,
	isConnectedUser,
	name,
}) => {
	// refs
	const inputRef = useRef<HTMLInputElement>(null);

	// state
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>(name);

	// mutation
	const { mutate, error, status } = useUpdateUser(id);

	// hooks
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing, inputRef]);

	// handlers
	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancelButton = () => {
		setIsEditing(false);
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (inputValue.length > 0 && inputValue !== name)
			mutate({ name: inputValue });
		if (status === "success") setIsEditing(false);
	};

	const handleOnChange = (e: any) => {
		setInputValue(e.target.value.replace(/ /g, "_"));
	};

	return (
		<div className="flex ">
			{isConnectedUser && isEditing ? (
				<div className="flex flex-col">
					<div className="flex items-center h-[40px]">
						<form onSubmit={handleSubmit}>
							<input
								ref={inputRef}
								name="name"
								className="bg-transparent border-solid border-2 "
								style={{
									padding: "",
								}}
								value={inputValue}
								onChange={handleOnChange}
							/>
							{status === "loading" ? (
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
								onClick={handleCancelButton}
							/>
						</button>
					</div>
					{status === "error" ? (
						<div>
							<ErrorItem error={error} />
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
						<button className="ml-4" onClick={handleEdit}>
							<FontAwesomeIcon fixedWidth icon={faPenToSquare} />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export { ProfileName };
