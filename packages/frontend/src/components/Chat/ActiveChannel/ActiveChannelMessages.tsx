import { MessageItem } from "components/Chat/MessageItem/MessageItem";
import { ServerMessageItem } from "components/Chat/ServerMessageItem/ServerMessageItem";
import React from "react";
import { useSelector } from "react-redux";
import { Channel, MessageType } from "types/chat/chat";
import { RootState } from "types/global/global";

interface ActiveChannelMessagesProps {
	activeChannel: Channel | null;
	messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ActiveChannelMessages: React.FC<ActiveChannelMessagesProps> = ({
	activeChannel,
	messagesEndRef,
}) => {
	const connectedUserId = useSelector(
		(store: RootState) => store.USER.user?.id
	);

	if (!connectedUserId) return null;

	return (
		<div className="flex flex-col h-full overflow-y-auto my-3">
			{activeChannel != null ? (
				<div className="w-full flex flex-col">
					{activeChannel.messages.map((message, index) => {
						if (message.type === MessageType.Normal)
							return (
								<MessageItem
									key={index}
									message={message}
									isConnectedUser={
										message.sender.id === connectedUserId
									}
								/>
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

export { ActiveChannelMessages };
