interface ChatModalProps {
	children: React.ReactNode;
	setShowModal: (value: boolean) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ children, setShowModal }) => {
	return (
		<div className="lg:hidden">
			<div className=" max-h-full h-full px-4 justify-center w-full flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-non">
				<div className="w-full my-6 mx-auto max-w-3xl rounded-lg">
					{children}
				</div>
			</div>
			<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
		</div>
	);
};

export { ChatModal };
