import React from "react";
import { Channel } from "../../../types/chat";
import { ChannelItem } from "../ChannelItem/ChannelItem";

interface ChannelListProps {
	title: string;
	channels: Channel[];
	activeChannel: Channel | null;
	handleClickChannel: (channelId: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
	title,
	channels,
	activeChannel,
	handleClickChannel,
}) => {
	return (
		<div className="h-full flex flex-col">
			<div className="mb-4 text-center underline text-white">
				<p>{title}</p>
			</div>
			<ul className="overflow-auto flex-grow">
				{channels.map((channel) => (
					<ChannelItem
						key={channel.id}
						handleClick={handleClickChannel}
						id={channel.id}
						name={channel.name}
						isActive={activeChannel?.id === channel.id}
					/>
				))}
			</ul>
		</div>
	);
};

export { ChannelList };
