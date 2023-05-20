import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Channel, ChannelType } from "types/chat/chat";

interface ChannelItemProps {
	channel: Channel;
	handleClick: (channel: Channel) => void;
	isActive: boolean;
	handleLeaveChannel: (channel: Channel) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
	channel,
	handleClick,
	isActive,
	handleLeaveChannel,
}) => {
	// states
	const [hover, setHover] = useState(false);

	// handlers
	const handleTouchStart = () => {
		setHover(true);
	};

	return (
		<li
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onTouchStart={handleTouchStart}
			style={{
				transition: "all 0.2s",
			}}
			className={`flex justify-between items-center hover:bg-astronaut-700 px-2 py-1 ${
				isActive === true ? "bg-astronaut-800" : ""
			}`}
		>
			<button
				onClick={() => handleClick(channel)}
				className="flex h-full w-full text-left cursor-pointer p-2 border-1 border-purple-600"
			>
				<div className="w-full text-xl">
					{channel.type !== ChannelType.Direct_message
						? channel.name.replace(/(.{10})..+/, "$1…")
						: channel.user?.name.replace(/(.{10})..+/, "$1…")}
				</div>
			</button>
			{(hover || isActive) && (
				<button
					onClick={() => handleLeaveChannel(channel)}
					className="h-full border-1 border-pink-600"
				>
					<FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
				</button>
			)}
		</li>
	);
};

export { ChannelItem };
