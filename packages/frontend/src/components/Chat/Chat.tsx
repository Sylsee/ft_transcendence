import { ActiveChannelMessages } from "components/Chat/ActiveChannel/ActiveChannelMessages";
import { ChannelModal } from "components/Chat/ChannelModal/ChannelModal";
import { ChatHeader } from "components/Chat/ChatHeader/ChatHeader";
import { ChatInput } from "components/Chat/ChatInput/ChatInput";
import { useJoinChannel } from "hooks/chat/useJoinChannel";
import { useMessageQuery } from "hooks/chat/useMessageQuery";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectActiveChannel,
	selectSelectedChannel,
	setActiveChannel,
	setIsMenuOpen,
	setSelectedChannel,
	setShowChannelModal,
	setShowChat,
	setShowChatModal,
	toggleChatMenu,
} from "store/chat-slice/chat-slice";
import { Channel, ChannelModalType, ChannelType } from "types/chat/chat";
import { RootState } from "types/global/global";
import { ChatMenu } from "./ChatMenu/ChatMenu";

interface ChatProps {
	channels: Channel[];
}

const Chat: React.FC<ChatProps> = ({ channels }) => {
	// refs
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// redux
	const dispatch = useDispatch();
	const activeChannelId = useSelector(
		(store: RootState) => store.CHAT.activeChannelId
	);
	const activeChannel = useSelector(selectActiveChannel);
	const selectedChannel = useSelector(selectSelectedChannel);
	const channelModalType = useSelector(
		(store: RootState) => store.CHAT.showChannelModal
	);
	const { refetch: refetchMessage } = useMessageQuery(activeChannel?.id);

	// mutations
	const { mutate: joinChannelMutation } = useJoinChannel();

	// hooks
	useLayoutEffect(() => {
		const scrollToBottom = () => {
			const current = messagesEndRef.current;
			if (current) {
				current.scrollIntoView({ behavior: "auto" });
			}
		};
		scrollToBottom();
	}, [activeChannel?.messages, messagesEndRef]);

	useEffect(() => {
		if (!activeChannelId) return;

		dispatch(setIsMenuOpen(false));
	}, [activeChannelId, dispatch]);

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
		dispatch(toggleChatMenu());
	};

	const handleCloseModal = () => {
		dispatch(setSelectedChannel(null));
		dispatch(setShowChannelModal(ChannelModalType.None));
	};

	const handleCloseChat = () => {
		dispatch(setShowChat(false));
	};

	const handleCloseChatModal = () => {
		dispatch(setShowChatModal(false));
	};

	const handleClickChannel = (channel: Channel) => {
		if (channel.permissions.isMember) {
			dispatch(setActiveChannel(channel.id));
			dispatch(setIsMenuOpen(false));
		} else if (
			!channel.permissions.isMember &&
			channel.type === ChannelType.Password_protected
		) {
			dispatch(setSelectedChannel(channel.id));
			dispatch(setShowChannelModal(ChannelModalType.Join));
		} else {
			joinChannelMutation({ id: channel.id, data: {} });
		}
	};

	return (
		<div className="relative h-full w-full overflow-hidden">
			{/* Chat */}
			<div className="absolute flex flex-col h-full w-full rounded-3xl bg-chatgpt-grey-400 pt-6 p-3 md:p-8">
				<ChatHeader
					toggleMenu={toggleMenu}
					handleCloseChat={handleCloseChat}
					handleCloseChatModal={handleCloseChatModal}
				/>
				<ActiveChannelMessages
					messagesEndRef={messagesEndRef}
					activeChannel={activeChannel}
				/>
				{activeChannel && <ChatInput channelId={activeChannel.id} />}
			</div>

			<ChatMenu
				handleClickChannel={handleClickChannel}
				channels={channels}
				toggleMenu={toggleMenu}
			/>

			<ChannelModal
				modalType={channelModalType}
				handleCloseModal={handleCloseModal}
				selectedChannel={selectedChannel}
			/>
		</div>
	);
};

export { Chat };
