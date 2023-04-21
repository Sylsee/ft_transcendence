import { useEffect, useRef, useState } from "react";
import { ApiErrorResponse } from "../../../../../types/global";
import { ErrorItem } from "../../../../Error/ErrorItem";

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
		<>
			<div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
				<div className="relative w-full my-6 mx-auto max-w-3xl">
					{/*content*/}
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
						{/*header*/}
						<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
							<h3 className="text-3xl font-semibold">
								{title} 2FA
							</h3>
							{displayCancelIcon && (
								<button
									className="p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => {
										handleCancel();
										setInputValue("");
									}}
								>
									<span className="bg-transparenth-6 w-6 text-2xl text-gray-500 hover:text-black  block outline-none focus:outline-none">
										×
									</span>
								</button>
							)}
						</div>
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
								{status === "error" && (
									<ErrorItem error={error} />
								)}
								{/*footer*/}
								<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => {
											handleCancel();
											setInputValue("");
										}}
									>
										{cancelValue}
									</button>
									<button
										className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="submit"
									>
										{title}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
		</>
	);
};

export { TwoFactorAuthenticationModal };
