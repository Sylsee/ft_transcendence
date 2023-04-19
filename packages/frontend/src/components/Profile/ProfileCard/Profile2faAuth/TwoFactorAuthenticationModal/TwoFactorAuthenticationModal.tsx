import { useEffect, useRef } from "react";
import { useEnableTwoFa } from "../../../../../hooks/auth/useEnableTwoFa";
import { useGenerateTwoFa } from "../../../../../hooks/auth/useGenerateTwoFa";
import { ErrorItem } from "../../../../Error/ErrorItem";
import { Loader } from "../../../../Loader/Loader";

interface TwoFactorAuthenticationModalProps {
	showModal: boolean;
	setShowModal: (showModal: boolean) => void;
}

const TwoFactorAuthenticationModal: React.FC<
	TwoFactorAuthenticationModalProps
> = ({ showModal, setShowModal }) => {
	// custom hooks
	const {
		data: generateTwoFaData,
		mutate: generateTwoFaMutate,
		status: generateTwoFaStatus,
		error: generateTwoFaError,
	} = useGenerateTwoFa();

	const {
		mutate: enableTwoFaMutate,
		status: enableTwoFaStatus,
		error: enableTwoFaError,
	} = useEnableTwoFa();

	// hooks
	useEffect(() => {
		generateTwoFaMutate();
	}, [generateTwoFaMutate]); // TODO : the useEffect is called twice, why ?

	useEffect(() => {
		if (enableTwoFaStatus === "success") {
			setShowModal(false);
		}
	}, [enableTwoFaStatus, setShowModal]);

	// refs
	const inputRef = useRef<HTMLInputElement>(null);

	// handlers
	const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputRef.current || inputRef.current.value.trim().length === 0)
			return;
		console.log(inputRef.current.value.trim());
		enableTwoFaMutate(inputRef.current.value.trim());
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
								Activate 2FA
							</h3>
							<button
								className="p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
								onClick={() => setShowModal(false)}
							>
								<span className="bg-transparenth-6 w-6 text-2xl text-gray-500 hover:text-black  block outline-none focus:outline-none">
									×
								</span>
							</button>
						</div>
						{/*body*/}
						<div className="relative p-6 flex-auto justify-center">
							<div className="flex justify-center">
								{generateTwoFaStatus === "success" ? (
									<div className="flex  flex-col justify-center items-center w-1/2">
										<img
											className="w-[200px] h-[200px]"
											src={generateTwoFaData.qrCode}
											alt="2fa QR Code"
										/>
										<div className="w-full max-w-1/2">
											<p className="break-words">
												{
													generateTwoFaData.manualEntryKey
												}
											</p>
										</div>
									</div>
								) : generateTwoFaStatus === "loading" ? (
									<Loader color="gray" />
								) : (
									<ErrorItem error={generateTwoFaError} />
								)}
							</div>
							{/* // form with input to enter the code */}
							<form
								onSubmit={handleSubmitForm}
								className="flex flex-col mt-4"
							>
								<label
									className="mb-2 text-xs font-bold text-gray-600"
									htmlFor="code"
								>
									Enter the code
								</label>
								<input
									className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
									type="text"
									name="code"
									id="code"
									placeholder="Enter the code"
									ref={inputRef}
								/>
								{enableTwoFaStatus === "error" && (
									<ErrorItem error={enableTwoFaError} />
								)}
								{/*footer*/}
								<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Close
									</button>
									<button
										className="bg-green-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="submit"
									>
										Enable
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
