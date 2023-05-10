import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChannelList } from "components/Chat/ChannelList/ChannelList";
import React from "react";
import { useSelector } from "react-redux";
import { selectActiveChannel } from "store/chat-slice/chat-slice";
import { Channel } from "types/chat/chat";
import { RootState } from "types/global/global";

interface ChatMenuProps {
	handleClickChannel: (channel: Channel) => void;
	handleCreateChannel: () => void;
	handleEditChannel: (channel: Channel) => void;
	channels: Channel[];
}

const ChatMenu: React.FC<ChatMenuProps> = ({
	handleClickChannel,
	handleCreateChannel,
	handleEditChannel,
	channels,
}) => {
	const isMenuOpen = useSelector((store: RootState) => store.CHAT.isMenuOpen);
	const activeChannel = useSelector(selectActiveChannel);
	return (
		<div
			className={`bg-mirage-950 absolute h-full top-0 left-0 w-64 p-4  transform transition-transform duration-300 ${
				isMenuOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			<div>
				<button onClick={handleCreateChannel}>
					<FontAwesomeIcon fixedWidth icon={faPlus} />
				</button>
			</div>
			<div className="grid grid-rows-2 gap-4 h-[calc(100%)]">
				<ChannelList
					handleEditChannel={handleEditChannel}
					title="Joined Channels"
					channels={channels.filter(
						(channel) => channel.permissions.isMember
					)}
					activeChannel={activeChannel}
					handleClickChannel={handleClickChannel}
				/>
				<ChannelList
					handleEditChannel={handleEditChannel}
					title="Other Channels"
					channels={channels.filter(
						(channel) => !channel.permissions.isMember
					)}
					activeChannel={activeChannel}
					handleClickChannel={handleClickChannel}
				/>
			</div>
		</div>
	);
};

export { ChatMenu };
