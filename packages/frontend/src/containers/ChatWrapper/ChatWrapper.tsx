import { Chat } from "components/Chat/Chat";
import { ChatModal } from "components/Chat/ChatModal/ChatModal";
import { useFetchChannels } from "hooks/chat/useFetchChannels";
import { useJoinChannel } from "hooks/chat/useJoinChannel";
import { useMessageQuery } from "hooks/chat/useMessageQuery";
import { useEffect, useRef, useState } from "react";
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

interface ChatWrapperProps {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({
	showModal,
	setShowModal,
}) => {
	// state
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showChannelModal, setShowChannelModal] = useState<ChannelModalType>(
		ChannelModalType.None
	);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// redux
	const dispatch = useDispatch();
	const showChat = useSelector((store: RootState) => store.CHAT.showChat);
	const channels = useSelector((store: RootState) => store.CHAT.channels);
	const activeChannel = useSelector(selectActiveChannel);
	const selectedChannel = useSelector(selectSelectedChannel);

	// queries
	useFetchChannels();
	const { refetch: refetchMessage } = useMessageQuery(activeChannel?.id);

	// mutations
	const { mutate: joinChannelMutation } = useJoinChannel();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 1024) {
				setShowModal(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setShowModal]);

	// handlers
	const handleEditChannel = (channel: Channel) => {
		dispatch(setSelectedChannel(channel.id));
		setShowChannelModal(ChannelModalType.Update);
	};

	const handleCreateChannel = () => {
		dispatch(setSelectedChannel(null));
		setShowChannelModal(ChannelModalType.Create);
	};

	const handleCloseModal = () => {
		dispatch(setSelectedChannel(null));
		setShowChannelModal(ChannelModalType.None);
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
			setIsMenuOpen(false);
		} else if (
			!channel.permissions.isMember &&
			channel.type === ChannelType.Password_protected
		) {
			dispatch(setSelectedChannel(channel.id));
			setShowChannelModal(ChannelModalType.Join);
		} else {
			joinChannelMutation({ id: channel.id, data: {} });
		}
	};

	if (showModal)
		return (
			<ChatModal setShowModal={setShowModal}>
				<Chat
					channels={channels}
					isMenuOpen={isMenuOpen}
					setIsMenuOpen={setIsMenuOpen}
					showChannelModal={showChannelModal}
					messagesEndRef={messagesEndRef}
					activeChannel={activeChannel}
					selectedChannel={selectedChannel}
					handleEditChannel={handleEditChannel}
					handleCreateChannel={handleCreateChannel}
					handleCloseModal={handleCloseModal}
					handleCloseChat={handleCloseChat}
					handleCloseChatModal={handleCloseChatModal}
					handleClickChannel={handleClickChannel}
					refetchMessage={refetchMessage}
					joinChannelMutation={joinChannelMutation}
				/>
			</ChatModal>
		);
	else if (showChat && !showModal)
		return (
			<div className="hidden lg:flex flex-col w-1/3 items-stretch max-h-full">
				<Chat
					channels={channels}
					isMenuOpen={isMenuOpen}
					setIsMenuOpen={setIsMenuOpen}
					showChannelModal={showChannelModal}
					messagesEndRef={messagesEndRef}
					activeChannel={activeChannel}
					selectedChannel={selectedChannel}
					handleEditChannel={handleEditChannel}
					handleCreateChannel={handleCreateChannel}
					handleCloseModal={handleCloseModal}
					handleCloseChat={handleCloseChat}
					handleCloseChatModal={handleCloseChatModal}
					handleClickChannel={handleClickChannel}
					refetchMessage={refetchMessage}
					joinChannelMutation={joinChannelMutation}
				/>
			</div>
		);
	else return null;
};

export { ChatWrapper };
