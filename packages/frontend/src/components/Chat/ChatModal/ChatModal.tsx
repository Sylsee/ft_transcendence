import React from "react";

interface ChatModalProps {
	children: React.ReactNode;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatModal: React.FC<ChatModalProps> = ({ children, setShowModal }) => {
	return (
		<>
			<div className="max-h-full justify-center w-full flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
				<div className="relative w-full my-6 mx-4 flex items-center">
					<div className="border-0 rounded-lg shadow-lg relative flex flex-col h-full w-full bg-white outline-none focus:outline-none">
						{/*header*/}
						<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
							<h3 className="text-3xl font-semibold">Chat</h3>
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
						<div className="flex-1 flex flex-col overflow-auto">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export { ChatModal };
