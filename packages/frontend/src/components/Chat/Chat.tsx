import { ActiveChannel } from "components/Chat/ActiveChannel/ActiveChannel";
import { ChannelModal } from "components/Chat/ChannelModal/ChannelModal";
import { ChatHeader } from "components/Chat/ChatHeader/ChatHeader";
import { ChatInput } from "components/Chat/ChatInput/ChatInput";
import { ChatMenu } from "components/Chat/ChatMenu/ChatMenu";
import { useJoinChannel } from "hooks/chat/useJoinChannel";
import { useMessageQuery } from "hooks/chat/useMessageQuery";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectActiveChannel,
	selectSelectedChannel,
	setActiveChannel,
	setSelectedChannel,
	setShowChat,
	setShowChatModal,
} from "store/chat-slice/chat-slice";
import { Channel, ChannelModalType, ChannelType } from "types/chat/chat";
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
		dispatch(setShowChat(false));
	};

	const handleCloseChatModal = () => {
		dispatch(setShowChatModal(false));
	};

	return (
		<div className="bg-mirage h-full items-stretch  flex flex-col ">
			<ChatHeader
				isMenuOpen={isMenuOpen}
				activeChannel={activeChannel}
				toggleMenu={toggleMenu}
				handleCloseChat={handleCloseChat}
				handleCloseChatModal={handleCloseChatModal}
			></ChatHeader>
			<div className="relative h-full flex flex-col items-stretch max-h-full overflow-hidden">
				<ActiveChannel
					messagesEndRef={messagesEndRef}
					activeChannel={activeChannel}
				/>
				<ChatMenu
					isMenuOpen={isMenuOpen}
					activeChannel={activeChannel}
					handleClickChannel={handleClickChannel}
					handleEditChannel={handleEditChannel}
					handleCreateChannel={handleCreateChannel}
					channels={channels}
				/>
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
