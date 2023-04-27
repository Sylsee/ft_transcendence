import { useJoinChannel } from "hooks/chat/useJoinChannel";

interface InvitationToastProps {
	content: string;
	channelId: string;
}

const InvitationToast: React.FC<InvitationToastProps> = ({
	content,
	channelId,
}) => {
	const { mutate } = useJoinChannel();

	// handlers
	const handleDecline = () => {};
	const handleAccept = () => {
		mutate({ id: channelId, data: {} });
	};

	return (
		<div className="flex flex-col">
			<div className="mb-2">{content}</div>
			<div className="flex">
				<button
					type="button"
					onClick={handleAccept}
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
