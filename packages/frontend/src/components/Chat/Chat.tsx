import { faBars, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChannelList } from "components/Chat/ChannelList/ChannelList";
import { ChannelModal } from "components/Chat/ChannelModal/ChannelModal";
import { ChatInput } from "components/Chat/ChatInput/ChatInput";
import { MessageItem } from "components/Chat/MessageItem/MessageItem";
import { useJoinChannel } from "hooks/chat/useJoinChannel";
import { useMessageQuery } from "hooks/chat/useMessageQuery";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectActiveChannel,
	selectSelectedChannel,
	setActiveChannel,
	setSelectedChannel,
	setShowChatModal,
} from "store/chat-slice/chat-slice";
import {
	Channel,
	ChannelModalType,
	ChannelType,
	MessageType,
} from "types/chat/chat";
import { RootState } from "types/global/global";

interface ChatProps {
	channels: Channel[];
}

const Chat: React.FC<ChatProps> = ({ channels }) => {
	// display management
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showModal, setShowModal] = useState<ChannelModalType>(
		ChannelModalType.None
	);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// redux
	const dispatch = useDispatch();
	const activeChannelId = useSelector(
		(store: RootState) => store.CHAT.activeChannelId
	);
	const activeChannel = useSelector(selectActiveChannel);
	const selectedChannel = useSelector(selectSelectedChannel);

	// mutations
	const { mutate: joinChannelMutation } = useJoinChannel();

	// queries
	const { refetch: refetchMessage } = useMessageQuery(activeChannel?.id);

	const scrollToBottom = () => {
		const current = messagesEndRef.current;
		if (current) {
			current.scrollIntoView({ behavior: "auto" });
		}
	};

	// hooks
	useLayoutEffect(() => {
		scrollToBottom();
	}, [activeChannel?.messages]);

	useEffect(() => {
		if (!activeChannelId) return;

		setIsMenuOpen(false);
	}, [activeChannelId]);

	useEffect(() => {
		if (!activeChannel) return;
		if (
			activeChannel.permissions.isMember &&
			!activeChannel.hasBeenFetched
		) {
			refetchMessage();
		}
	}, [activeChannel, refetchMessage, joinChannelMutation]);

	// handlers
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleClickChannel = (channel: Channel) => {
		if (channel.permissions.isMember) {
			dispatch(setActiveChannel(channel.id));
			setIsMenuOpen(false);
		} else if (
			!channel.permissions.isMember &&
			channel.type === ChannelType.Password_protected
		) {
			dispatch(setSelectedChannel(channel.id));
			setShowModal(ChannelModalType.Join);
		} else {
			joinChannelMutation({ id: channel.id, data: {} });
		}
	};

	const handleEditChannel = (channel: Channel) => {
		dispatch(setSelectedChannel(channel.id));
		setShowModal(ChannelModalType.Update);
	};

	const handleCreateChannel = () => {
		dispatch(setSelectedChannel(null));
		setShowModal(ChannelModalType.Create);
	};

	const handleCloseModal = () => {
		dispatch(setSelectedChannel(null));
		setShowModal(ChannelModalType.None);
	};

	const handleCloseChat = () => {
		dispatch(setShowChatModal(false));
	};

	return (
		<div
			style={{
				backgroundImage:
					// "linear-gradient(to right top, #03152b, #241e40, #482348, #6a2a50, #8b3345)",
					"linear-gradient(to right top, #09203f, #2c2f54, #4d3d64, #6e4c70, #8d5b77)",
			}}
			className="h-full items-stretch  flex flex-col rounded-lg p-1"
		>
			<div className="flex">
				<div className="w-4">
					<button className="" onClick={toggleMenu}>
						<FontAwesomeIcon
							fixedWidth
							icon={isMenuOpen ? faXmark : faBars}
						/>
					</button>
				</div>
				<div className="flex-auto flex-grow flex justify-center cursor-default">
					{activeChannel && (
						<div className="">
							{activeChannel.type === ChannelType.Direct_message
								? activeChannel?.user?.name
								: activeChannel.name}
						</div>
					)}
				</div>
				<div>
					<button onClick={handleCloseChat} className="">
						<FontAwesomeIcon fixedWidth icon={faXmark} />
					</button>
				</div>
			</div>
			<div
				onClick={() => {}}
				className="relative h-full flex flex-col items-stretch max-h-full overflow-hidden"
			>
				<div className="flex flex-col items-stretch h-full">
					{activeChannel != null ? (
						<div className="w-full flex flex-col flex-grow items-stretch max-h-full overflow-y-auto overflow-x-hidden p-4 text-black">
							{activeChannel.messages.map((message, index) => {
								if (message.type === MessageType.Normal)
									return (
										<MessageItem
											key={index}
											message={message}
										/>
									);
								else if (message.type === MessageType.Special)
									return (
										<div
											key={index}
											className="text-red-600 p-4 font-bold"
										>
											{message.content}
										</div>
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
				<div
					style={{
						backgroundImage:
							// "linear-gradient(to right top, #03152b, #241e40, #482348, #6a2a50, #8b3345)",
							"linear-gradient(to right top, #09203f, #2c2f54, #4d3d64, #6e4c70, #8d5b77)",
					}}
					className={`absolute h-full top-0 left-0 w-64 p-4  transform transition-transform duration-300 border-r-2 border-t-2  ${
						isMenuOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<div>
						<button onClick={handleCreateChannel}>
							<FontAwesomeIcon fixedWidth icon={faPlus} />
						</button>
					</div>
					<div className="grid grid-rows-2 gap-4 h-[calc(100%)]">
						<ChannelList
							handleEditChannel={handleEditChannel}
							title="Joined Channels"
							channels={channels.filter(
								(channel) => channel.permissions.isMember
							)}
							activeChannel={activeChannel}
							handleClickChannel={handleClickChannel}
						/>
						<ChannelList
							handleEditChannel={handleEditChannel}
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
			{activeChannel && <ChatInput channelId={activeChannel.id} />}
			<ChannelModal
				modalType={showModal}
				handleCloseModal={handleCloseModal}
				selectedChannel={selectedChannel}
			/>
		</div>
	);
};

export { Chat };
