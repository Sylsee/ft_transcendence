import {
	faCheck,
	faPenToSquare,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorItem } from "components/Error/ErrorItem";
import { useUpdateUser } from "hooks/user/useUpdateUser";
import { useEffect, useRef, useState } from "react";

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
	const { mutate, error, status } = useUpdateUser();

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
	};

	useEffect(() => {
		if (status === "success") {
			setIsEditing(false);
		}
	}, [status]);

	useEffect(() => {
		console.log(isEditing);
	}, [isEditing]);

	const handleOnChange = (e: any) => {
		setInputValue(e.target.value.replace(/ /g, "_"));
	};

	return (
		<div className="flex ">
			{isConnectedUser && isEditing ? (
				<div className="flex flex-col justify-center items-center">
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
								<button
									type="submit"
									className="ml-4"
									disabled={status === "loading"}
								>
									<FontAwesomeIcon
										fixedWidth
										icon={faCheck}
									/>
								</button>
							</form>
							<button className="ml-4">
								<FontAwesomeIcon
									fixedWidth
									icon={faXmark}
									onClick={handleCancelButton}
								/>
							</button>
						</div>
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
