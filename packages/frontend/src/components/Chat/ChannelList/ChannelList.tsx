import { ChannelItem } from "components/Chat/ChannelItem/ChannelItem";
import { useState } from "react";
import { Channel } from "types/chat/chat";

interface ChannelListProps {
	channels: Channel[];
	activeChannel: Channel | null;
	handleClickChannel: (channel: Channel) => void;
	handleEditChannel: (channel: Channel) => void;
	handleLeaveChannel: (channel: Channel) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
	channels,
	activeChannel,
	handleClickChannel,
	handleEditChannel,
	handleLeaveChannel,
}) => {
	const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);

	return (
		<div className="h-full flex flex-col">
			<ul className="overflow-auto flex-grow">
				{channels.map((channel) => (
					<ChannelItem
						key={channel.id}
						channel={channel}
						handleClick={handleClickChannel}
						handleLeaveChannel={handleLeaveChannel}
						isActive={activeChannel?.id === channel.id}
						handleEditChannel={handleEditChannel}
						openedMenuId={openedMenuId}
						setOpenedMenuId={setOpenedMenuId}
					/>
				))}
			</ul>
		</div>
	);
};

export { ChannelList };
