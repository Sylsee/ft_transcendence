import { Chat } from "components/Chat/Chat";
import { ChatModal } from "components/Chat/ChatModal/ChatModal";
import { useFetchChannels } from "hooks/chat/useFetchChannels";
import { useSelector } from "react-redux";
import { RootState } from "types/global/global";

interface ChatWrapperProps {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({
	showModal,
	setShowModal,
}) => {
	const showChat = useSelector((store: RootState) => store.CHAT.showChat);
	const channels = useSelector((store: RootState) => store.CHAT.channels);
	useFetchChannels();

	if (showChat)
		return (
			<div className="hidden lg:flex flex-col w-1/3 items-stretch max-h-full">
				<Chat channels={channels} />
			</div>
		);
	else if (showModal)
		return (
			<ChatModal setShowModal={setShowModal}>
				<Chat channels={channels} />
			</ChatModal>
		);
	else return null;
};

export { ChatWrapper };
