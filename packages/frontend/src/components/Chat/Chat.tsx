import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useJoinChannel } from "../../hooks/chat/useJoinChannel";
import { useMessageQuery } from "../../hooks/chat/useMessageQuery";
import {
	selectActiveChannel,
	setActiveChannel,
} from "../../store/chat-slice/chat-slice";
import { Channel, ChannelType } from "../../types/chat";
import { ChannelList } from "./ChannelList/ChannelList";
import { ChatInput } from "./ChatInput/ChatInput";
import { MessageItem } from "./MessageItem/MessageItem";

interface ChatProps {
	channels: Channel[];
}

const Chat: React.FC<ChatProps> = ({ channels }) => {
	// display management
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// redux
	const activeChannel = useSelector(selectActiveChannel);
	const dispatch = useDispatch();

	// mutations
	const { mutate: joinChannelMutation } = useJoinChannel(activeChannel?.id);

	// queries
	const { refetchMessage } = useMessageQuery(activeChannel?.id);

	const scrollToBottom = () => {
		const current = messagesEndRef.current;
		if (current) {
			setTimeout(() => {
				current.scrollIntoView({ behavior: "auto" });
			}, 0);
		}
	};

	useLayoutEffect(() => {
		scrollToBottom();
	}, [activeChannel?.messages]);

	useEffect(() => {
		if (!activeChannel) return;

		if (
			!activeChannel.permissions.isMember &&
			activeChannel.type === ChannelType.public
		)
			joinChannelMutation({});

		if (
			activeChannel.permissions.isMember &&
			!activeChannel.hasBeenFetched
		) {
			refetchMessage();
		}
	}, [activeChannel, refetchMessage, joinChannelMutation]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// handle click on channel
	const handleClickChannel = (channelId: string) => {
		dispatch(setActiveChannel(channelId));
		setIsMenuOpen(false);
	};

	return (
		<div className="h-full items-stretch  flex flex-col bg-gray-800">
			<button className="" onClick={toggleMenu}>
				{isMenuOpen ? "Close" : "Open"}
			</button>
			<div
				onClick={() => setIsMenuOpen(false)}
				className="relative h-full flex flex-col items-stretch max-h-full overflow-hidden"
			>
				<div className="flex flex-col items-stretch h-full">
					{activeChannel != null ? (
						<div className="flex flex-col flex-grow items-stretch max-h-full overflow-y-auto p-4 text-black">
							{activeChannel.messages.map((message) => (
								<MessageItem
									key={message.id}
									message={message}
								/>
							))}

							<div ref={messagesEndRef}></div>
						</div>
					) : (
						<div className="flex justify-center items-center flex-grow">
							<p>No active channel</p>
						</div>
					)}
				</div>
				<div
					className={`absolute h-full top-0 left-0 w-64 p-4 bg-gray-700 transform transition-transform duration-300 ${
						isMenuOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<div className="grid grid-rows-2 gap-4 h-[calc(100%)]">
						<ChannelList
							title="Joined Channels"
							channels={channels.filter(
								(channel) => channel.permissions.isMember
							)}
							activeChannel={activeChannel}
							handleClickChannel={handleClickChannel}
						/>
						<ChannelList
							title="Other Channels"
							channels={channels.filter(
								(channel) => !channel.permissions.isMember
							)}
							activeChannel={activeChannel}
							handleClickChannel={handleClickChannel}
						/>
					</div>
				</div>
			</div>
			{activeChannel && (
				<ChatInput
					scrollToBottom={scrollToBottom}
					channelId={activeChannel.id}
				/>
			)}
		</div>
	);
};

export { Chat };
