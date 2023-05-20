import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChannelList } from "components/Chat/ChannelList/ChannelList";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveChannel } from "store/chat-slice/chat-slice";
import { Channel } from "types/chat/chat";
import { RootState } from "types/global/global";
import { ChatMenuButton } from "./ChatMenuButton/ChatMenuButton";

interface ChatMenuProps {
	handleClickChannel: (channel: Channel) => void;
	handleCreateChannel: () => void;
	channels: Channel[];
	toggleMenu: () => void;
}

const ChatMenu: React.FC<ChatMenuProps> = ({
	handleClickChannel,
	handleCreateChannel,
	channels,
	toggleMenu,
}) => {
	const isMenuOpen = useSelector((store: RootState) => store.CHAT.isMenuOpen);
	const activeChannel = useSelector(selectActiveChannel);

	const [channelsIsJoinedFilter, setChannelsIsJoinedFilter] = useState(true);

	const handleClickJoined = () => {
		setChannelsIsJoinedFilter(true);
	};

	const handleClickAccessible = () => {
		setChannelsIsJoinedFilter(false);
	};

	return (
		<div
			className={`flex flex-col bg-mirage-950 absolute h-full top-0 left-0 w-64 md:w-full md:max-w-[400px] transform transition-transform duration-300 ${
				isMenuOpen ? "translate-x-0" : "-translate-x-full"
			} rounded-3xl`}
		>
			<div className="flex justify-center items-center pt-3 pb-2 md:px-9 md:pt-8 md:pb-3">
				<button onClick={toggleMenu} className="h-full md:mr-1">
					<FontAwesomeIcon fixedWidth icon={faClose} size="xl" />
				</button>
				<div className="flex flex-grow justify-center items-center">
					<ChatMenuButton
						name="Joined"
						handleClick={handleClickJoined}
						isSelected={channelsIsJoinedFilter}
					/>
					<ChatMenuButton
						name="Accessible"
						handleClick={handleClickAccessible}
						isSelected={!channelsIsJoinedFilter}
					/>
				</div>
			</div>
			<div className="overflow-auto flex-grow">
				<ChannelList
					channels={channels.filter(
						(channel) =>
							channelsIsJoinedFilter ===
							channel.permissions.isMember
					)}
					activeChannel={activeChannel}
					handleClickChannel={handleClickChannel}
				/>
			</div>
			<div className="flex justify-center items-center">
				<button
					onClick={handleCreateChannel}
					className="w-full bg-mirage-900 text-white rounded-b-3xl py-2 px-4"
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
		</div>
	);
};

export { ChatMenu };
