import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import {
	setSelectedChannel,
	setShowChannelModal,
} from "store/chat-slice/chat-slice";
import { ChannelModalType } from "types/chat/chat";

interface AddChannelItemProps {}

const AddChannelItem: React.FC<AddChannelItemProps> = () => {
	const dispatch = useDispatch();

	const handleCreateChannel = () => {
		dispatch(setSelectedChannel(null));
		dispatch(setShowChannelModal(ChannelModalType.Create));
	};

	return (
		<div className="flex justify-center items-center">
			<button
				onClick={handleCreateChannel}
				className="w-full bg-shark hover:bg-gun-powder text-white rounded-b-3xl py-2 px-4"
			>
				<FontAwesomeIcon
					fixedWidth
					icon={faPlus}
					size="lg"
					className="mr-1"
				/>
				New Channel
			</button>
		</div>
	);
};

export { AddChannelItem };
