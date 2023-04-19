import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels } from "../../api/chat/chatRequests";
import { Chat } from "../../components/Chat/Chat";
import { ChatModal } from "../../components/Chat/ChatModal/ChatModal";
import { setChannels } from "../../store/chat-slice/chat-slice";
import { RootState } from "../../types/global";

interface ChatWrapperProps {
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({
	showModal,
	setShowModal,
}) => {
	const dispatch = useDispatch();
	const channels = useSelector((store: RootState) => store.CHAT.channels);

	useQuery(["channels"], fetchChannels, {
		onSuccess: (data) => {
			console.log("channels fetched", data);
			dispatch(setChannels(data));
		},
		refetchOnWindowFocus: false,
	});

	if (!showModal)
		return (
			<div className="hidden lg:flex flex-col w-2/5 items-stretch max-h-full">
				<Chat channels={channels} />
			</div>
		);

	return (
		<ChatModal setShowModal={setShowModal}>
			<Chat channels={channels} />
		</ChatModal>
	);
};

export { ChatWrapper };
