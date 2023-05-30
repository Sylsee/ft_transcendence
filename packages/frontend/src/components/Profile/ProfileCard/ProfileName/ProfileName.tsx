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

	useEffect(() => {
		setInputValue(name);
	}, [name]);

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

	const handleOnChange = (e: any) => {
		setInputValue(e.target.value.replace(/ /g, "_"));
	};

	return (
		<div className="flex h-1/2 justify-center items-center grow">
			{isConnectedUser && isEditing ? (
				<div className="flex flex-col justify-center items-center">
					<div className="flex flex-col">
						<div className="flex items-center h-[40px] flex-wrap">
							<form onSubmit={handleSubmit} className="flex">
								<div className="w-1.2 grow">
									<input
										ref={inputRef}
										name="name"
										className="p-1 bg-transparent border-solid border-2 rounded-lg focus:outline-none w-full"
										value={inputValue}
										onChange={handleOnChange}
									/>
								</div>
								<div className="flex justify-center items-center">
									<button
										type="submit"
										className="ml-2 p-1"
										disabled={status === "loading"}
									>
										<FontAwesomeIcon
											fixedWidth
											icon={faCheck}
										/>
									</button>
								</div>
								<button className="ml-2 p-1" type="submit">
									<FontAwesomeIcon
										fixedWidth
										icon={faXmark}
										onClick={handleCancelButton}
									/>
								</button>
							</form>
						</div>
					</div>
					{status === "error" ? (
						<div>
							<ErrorItem error={error} />
						</div>
					) : null}
				</div>
			) : (
				<div className="flex items-center min-h-[40px] flex-wrap">
					<div className="font-bold mr-4">
						<p>name:</p>
					</div>
					<div className="text-2xl grow mr-4">
						<div
							className="text-left"
							style={{
								wordWrap: "break-word",
								wordBreak: "break-word",
							}}
						>
							<p>{name}</p>
						</div>
					</div>
					{isConnectedUser && (
						<button className="" onClick={handleEdit}>
							<FontAwesomeIcon fixedWidth icon={faPenToSquare} />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export { ProfileName };
