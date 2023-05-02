import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Channel, ChannelType } from "types/chat/chat";

interface ChatHeaderProps {
	isMenuOpen: boolean;
	activeChannel: Channel | null;
	handleCloseChat: () => void;
	handleCloseChatModal: () => void;
	toggleMenu: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	isMenuOpen,
	activeChannel,
	handleCloseChat,
	handleCloseChatModal,
	toggleMenu,
}) => {
	return (
		<div className="flex">
			<div className="w-4">
				<button className="" onClick={toggleMenu}>
					<FontAwesomeIcon
						fixedWidth
						icon={isMenuOpen ? faXmark : faBars}
					/>
				</button>
			</div>
			<div className="flex-auto flex-grow flex justify-center items-center cursor-default">
				{activeChannel && (
					<div className="">
						{activeChannel.type === ChannelType.Direct_message
							? activeChannel?.user?.name
							: activeChannel.name}
					</div>
				)}
			</div>
			<div>
				<button onClick={handleCloseChatModal} className="lg:hidden">
					<FontAwesomeIcon fixedWidth icon={faXmark} />
				</button>
				<button onClick={handleCloseChat} className="hidden lg:block">
					<FontAwesomeIcon fixedWidth icon={faXmark} />
				</button>
			</div>
		</div>
	);
};

export { ChatHeader };
