import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
	setSelectedChannel,
	setShowChannelModal,
} from "store/chat-slice/chat-slice";
import { Channel, ChannelModalType, ChannelType } from "types/chat/chat";

interface ChannelItemProps {
	channel: Channel;
	handleClick: (channel: Channel) => void;
	isActive: boolean;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
	channel,
	handleClick,
	isActive,
}) => {
	// states
	const [hover, setHover] = useState(false);

	// redux
	const dispatch = useDispatch();

	// variables
	const canLeave =
		channel.permissions.isMember &&
		channel.type !== ChannelType.Direct_message;

	// handlers
	const handleTouchStart = () => {
		setHover(true);
	};

	const handleLeaveChannel = (channel: Channel) => {
		dispatch(setSelectedChannel(channel.id));
		dispatch(setShowChannelModal(ChannelModalType.Leave));
	};

	return (
		<li
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onTouchStart={handleTouchStart}
			style={{
				transition: "all 0.2s",
			}}
			className={`flex justify-between items-center ${
				isActive === true ? "bg-tuna" : "hover:bg-light-shark"
			}`}
		>
			<button
				onClick={() => handleClick(channel)}
				className="flex h-full w-full text-left cursor-pointer py-3 px-4"
			>
				<div className="w-full text-xl">
					{channel.type !== ChannelType.Direct_message
						? channel.name.replace(/(.{10})..+/, "$1…")
						: channel.user?.name.replace(/(.{10})..+/, "$1…")}
				</div>
			</button>
			{canLeave && (hover || isActive) && (
				<button
					onClick={() => handleLeaveChannel(channel)}
					className="h-full mx-2"
				>
					<FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
				</button>
			)}
		</li>
	);
};

export { ChannelItem };
