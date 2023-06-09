import { Chat } from "components/Chat/Chat";
import { ChatModal } from "components/Chat/ChatModal/ChatModal";
import { useFetchChannels } from "hooks/chat/useFetchChannels";
import { useEffect } from "react";
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
	// redux
	const showChat = useSelector((store: RootState) => store.CHAT.showChat);
	const channels = useSelector((store: RootState) => store.CHAT.channels);

	// queries
	useFetchChannels();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 1280) {
				setShowModal(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setShowModal]);

	if (showModal)
		return (
			<ChatModal setShowModal={setShowModal}>
				<Chat channels={channels} />
			</ChatModal>
		);
	else if (showChat && !showModal)
		return (
			<div className="hidden xl:flex flex-col w-1/3 items-stretch max-h-full mx-0 md:mr-10 py-8">
				<Chat channels={channels} />
			</div>
		);
	else return null;
};

export { ChatWrapper };
