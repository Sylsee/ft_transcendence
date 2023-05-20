import { ChannelItem } from "components/Chat/ChannelItem/ChannelItem";
import { Channel } from "types/chat/chat";

interface ChannelListProps {
	channels: Channel[];
	activeChannel: Channel | null;
	handleClickChannel: (channel: Channel) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
	channels,
	activeChannel,
	handleClickChannel,
}) => {
	return (
		<div className="h-full flex flex-col">
			<ul className="overflow-auto flex-grow">
				{channels.map((channel) => (
					<ChannelItem
						key={channel.id}
						channel={channel}
						handleClick={handleClickChannel}
						isActive={activeChannel?.id === channel.id}
					/>
				))}
			</ul>
		</div>
	);
};

export { ChannelList };
