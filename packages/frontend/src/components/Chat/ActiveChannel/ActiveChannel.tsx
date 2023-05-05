import { MessageItem } from "components/Chat/MessageItem/MessageItem";
import { ServerMessageItem } from "components/Chat/ServerMessageItem/ServerMessageItem";
import React from "react";
import { Channel, MessageType } from "types/chat/chat";

interface ActiveChannelProps {
	activeChannel: Channel | null;
	messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ActiveChannel: React.FC<ActiveChannelProps> = ({
	activeChannel,
	messagesEndRef,
}) => {
	return (
		<div className="flex flex-col items-stretch h-full">
			{activeChannel != null ? (
				<div className="w-full flex flex-col flex-grow items-stretch max-h-full overflow-y-auto overflow-x-hidden p-4 text-black">
					{activeChannel.messages.map((message, index) => {
						if (message.type === MessageType.Normal)
							return (
								<MessageItem key={index} message={message} />
							);
						else if (message.type === MessageType.Special)
							return (
								<ServerMessageItem
									key={index}
									content={message.content}
								/>
							);
						else return null;
					})}
					<div ref={messagesEndRef}></div>
				</div>
			) : (
				<div className="flex justify-center items-center flex-grow">
					<p>No active channel</p>
				</div>
			)}
		</div>
	);
};

export { ActiveChannel };
