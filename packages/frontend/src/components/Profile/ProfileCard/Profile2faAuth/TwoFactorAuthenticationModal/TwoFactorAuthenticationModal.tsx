import { ErrorItem } from "components/Error/ErrorItem";
import { Modal } from "components/Modal/Modal";
import { ModalFooter } from "components/Modal/ModalFooter/ModalFooter";
import { ModalHeader } from "components/Modal/ModalHeader/ModalHeader";
import { useEffect, useRef, useState } from "react";
import { ApiErrorResponse } from "types/global/global";

interface TwoFactorAuthenticationModalProps {
	title: string;
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
	children?: React.ReactNode;
	handleSubmit: (code: string) => void;
	status?: "loading" | "error" | "success" | "idle";
	error: ApiErrorResponse | null;
	cancelValue?: string;
	handleCancel?: () => void;
	displayCancelIcon?: boolean;
}

const TwoFactorAuthenticationModal: React.FC<
	TwoFactorAuthenticationModalProps
> = ({
	title,
	showModal,
	setShowModal,
	children,
	handleSubmit,
	status,
	error,
	cancelValue = "Cancel",
	handleCancel = () => {
		setShowModal(false);
	},
	displayCancelIcon = true,
}) => {
	// state
	const [inputValue, setInputValue] = useState<string>("");

	// refs
	const inputRef = useRef<HTMLInputElement>(null);

	// hooks
	useEffect(() => {
		if (showModal && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showModal, inputRef]);

	// handlers
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value.trim());
	};

	const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputValue.length === 0) return;
		handleSubmit(inputValue);
	};

	if (!showModal) return null;
	return (
		<Modal>
			<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
				<ModalHeader
					title={`${title} 2FA`}
					handleCancel={() => {
						handleCancel();
						setInputValue("");
					}}
					displayCancelIcon={displayCancelIcon}
				/>
				{/*body*/}
				<div className="relative p-6 flex-auto justify-center">
					{children}
					{/* // form with input to enter the code */}
					<form
						onSubmit={(e) => handleSubmitForm(e)}
						className="flex flex-col mt-4"
					>
						<label
							className="mb-2 text-xs font-bold text-gray-600"
							htmlFor="code"
						>
							Enter the code
						</label>
						<input
							onChange={(e) => handleInputChange(e)}
							className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
							type="text"
							name="code"
							id="code"
							placeholder="Enter the code"
							ref={inputRef}
							value={inputValue}
						/>
						{status === "error" && <ErrorItem error={error} />}
						{/*footer*/}
						<ModalFooter
							cancelValue={cancelValue}
							handleCancel={() => {
								handleCancel();
								setInputValue("");
							}}
							acceptValue={title}
						/>
					</form>
				</div>
			</div>
		</Modal>
	);
};

export { TwoFactorAuthenticationModal };
