import { UseMutateFunction } from "@tanstack/react-query";
import { ActiveChannel } from "components/Chat/ActiveChannel/ActiveChannel";
import { ChannelModal } from "components/Chat/ChannelModal/ChannelModal";
import { ChatHeader } from "components/Chat/ChatHeader/ChatHeader";
import { ChatInput } from "components/Chat/ChatInput/ChatInput";
import { ChatMenu } from "components/Chat/ChatMenu/ChatMenu";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Channel, ChannelModalType, JoinChannelRequest } from "types/chat/chat";
import { ApiErrorResponse, RootState } from "types/global/global";
import { ChannelPayload } from "types/socket/socket";

interface ChatProps {
	channels: Channel[];
	isMenuOpen: boolean;
	setIsMenuOpen: (value: boolean) => void;
	showChannelModal: ChannelModalType;
	messagesEndRef: React.RefObject<HTMLDivElement>;
	activeChannel: Channel | null;
	selectedChannel: Channel | null;
	handleEditChannel: (channel: Channel) => void;
	handleCreateChannel: () => void;
	handleCloseModal: () => void;
	handleCloseChat: () => void;
	handleCloseChatModal: () => void;
	handleClickChannel: (channel: Channel) => void;
	refetchMessage: () => void;
	joinChannelMutation: UseMutateFunction<
		ChannelPayload,
		ApiErrorResponse,
		JoinChannelRequest,
		unknown
	>;
}

const Chat: React.FC<ChatProps> = ({
	channels,
	isMenuOpen,
	setIsMenuOpen,
	showChannelModal,
	messagesEndRef,
	activeChannel,
	selectedChannel,
	handleEditChannel,
	handleCreateChannel,
	handleCloseModal,
	handleCloseChat,
	handleCloseChatModal,
	handleClickChannel,
	refetchMessage,
	joinChannelMutation,
}) => {
	// redux
	const activeChannelId = useSelector(
		(store: RootState) => store.CHAT.activeChannelId
	);

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

		setIsMenuOpen(false);
	}, [activeChannelId, setIsMenuOpen]);

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
				modalType={showChannelModal}
				handleCloseModal={handleCloseModal}
				selectedChannel={selectedChannel}
			/>
		</div>
	);
};

export { Chat };
