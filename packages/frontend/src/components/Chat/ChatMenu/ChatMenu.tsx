import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChannelList } from "components/Chat/ChannelList/ChannelList";
import { AddChannelItem } from "components/Chat/ChatMenu/AddChannelItem/AddChannelItem";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveChannel } from "store/chat-slice/chat-slice";
import { Channel } from "types/chat/chat";
import { RootState } from "types/global/global";
import { ChatMenuButton } from "./ChatMenuButton/ChatMenuButton";

interface ChatMenuProps {
	handleClickChannel: (channel: Channel) => void;
	channels: Channel[];
	toggleMenu: () => void;
}

const ChatMenu: React.FC<ChatMenuProps> = ({
	handleClickChannel,
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
			className={`flex flex-col bg-shark absolute h-full top-0 left-[-1px] w-64 md:w-full md:max-w-[400px] transform transition-transform duration-300 ${
				isMenuOpen
					? "translate-x-[1px] shadow-right"
					: "-translate-x-full"
			} rounded-3xl`}
		>
			{/* ChatMenuHeader */}
			<div className="flex justify-center items-center pt-5 px-1 pb-2 md:pl-8 md:pt-7 md:pb-4">
				<button onClick={toggleMenu} className="h-full">
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
			{/* ChatMenuBody */}
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
			{/* ChatMenuFooter */}
			<AddChannelItem />
		</div>
	);
};

export { ChatMenu };
