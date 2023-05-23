import { faBars, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as ArrowDown } from "assets/icons/chat/arrow-down.svg";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectActiveChannel,
	setSelectedChannel,
	setShowChannelModal,
} from "store/chat-slice/chat-slice";
import { Channel, ChannelModalType, ChannelType } from "types/chat/chat";

interface ChatHeaderProps {
	handleCloseChat: () => void;
	handleCloseChatModal: () => void;
	toggleMenu: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	handleCloseChat,
	handleCloseChatModal,
	toggleMenu,
}) => {
	const activeChannel = useSelector(selectActiveChannel);
	const dispatch = useDispatch();

	const handleEditChannel = (channel: Channel) => {
		dispatch(setSelectedChannel(channel.id));

		if (channel.type === ChannelType.Direct_message) {
			dispatch(setShowChannelModal(ChannelModalType.Delete));
		} else {
			dispatch(setShowChannelModal(ChannelModalType.Update));
		}
	};

	return (
		<div className="flex justify-center items-center">
			<div>
				<button onClick={toggleMenu}>
					<FontAwesomeIcon fixedWidth icon={faBars} size="xl" />
				</button>
			</div>
			<div className="flex-auto flex-grow flex justify-center items-center cursor-default">
				{activeChannel && (
					<div>
						<div className="text-center text-2xl hidden 2xl:block">
							{activeChannel.type === ChannelType.Direct_message
								? activeChannel?.user?.name.replace(
										/(.{14})..+/,
										"$1…"
								  )
								: activeChannel.name.replace(
										/(.{14})..+/,
										"$1…"
								  )}
						</div>
						<div className="text-center text-2xl 2xl:hidden">
							{activeChannel.type === ChannelType.Direct_message
								? activeChannel?.user?.name.replace(
										/(.{7})..+/,
										"$1…"
								  )
								: activeChannel.name.replace(
										/(.{7})..+/,
										"$1…"
								  )}
						</div>
					</div>
				)}
				{activeChannel &&
					(activeChannel.permissions.canModify ||
						activeChannel.permissions.canDelete) && (
						<div className="flex justify-center items-center">
							<button
								onClick={() => handleEditChannel(activeChannel)}
								className="ml-3"
							>
								<FontAwesomeIcon icon={faEllipsis} size="lg" />
							</button>
						</div>
					)}
			</div>
			<div>
				<button onClick={handleCloseChatModal} className="lg:hidden">
					<ArrowDown className="w-6 h-6" />
				</button>
				<button onClick={handleCloseChat} className="hidden lg:block">
					<ArrowDown className="w-6 h-6" />
				</button>
			</div>
		</div>
	);
};

export { ChatHeader };
