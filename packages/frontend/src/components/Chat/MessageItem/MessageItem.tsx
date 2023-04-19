import React from "react";
import { Link } from "react-router-dom";
import { Message } from "../../../types/chat";

interface MessageItemProps {
	message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
	const formatDate = (timestamp: Date) => {
		const date = new Date(timestamp);
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${month}/${day}/${year} ${hours}:${minutes}`;
	};

	return (
		<div className="flex items-start space-x-4 p-2">
			<Link to={`/user/${message.sender.id}`}>
				<img
					src={message.sender.avatarUrl}
					alt={`${message.sender.name} avatar`}
					className="w-12 h-12 rounded-full"
					referrerPolicy="no-referrer"
				/>
			</Link>
			<div>
				<div className="text-gray-500">
					<span className="font-semibold text-black">
						{message.sender.name}
					</span>
					<span>{formatDate(message.timestamp)}</span>
				</div>
				<div className="text-white">{message.content}</div>
			</div>
		</div>
	);
};

export { MessageItem };
