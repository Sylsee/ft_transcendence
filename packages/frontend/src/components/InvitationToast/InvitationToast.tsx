interface InvitationToastProps {
	content: string;
	id: string;
	handleAccept: (id: string) => void;
	handleDecline: () => void;
}

const InvitationToast: React.FC<InvitationToastProps> = ({
	content,
	id,
	handleAccept,
	handleDecline,
}) => {
	return (
		<div className="flex flex-col">
			<div className="mb-2">{content}</div>
			<div className="flex">
				<button
					type="button"
					onClick={() => handleAccept(id)}
					className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					Accept
				</button>
				<button
					type="button"
					onClick={handleDecline}
					className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
				>
					Decline
				</button>
			</div>
		</div>
	);
};

export { InvitationToast };
