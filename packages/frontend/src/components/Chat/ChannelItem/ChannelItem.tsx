import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeleteChannel } from "hooks/chat/useDeleteChannel";
import { useLeaveChannel } from "hooks/chat/useLeaveChannel";
import { useEffect, useState } from "react";
import { Channel, ChannelType } from "types/chat/chat";

interface ChannelItemProps {
	channel: Channel;
	handleClick: (channel: Channel) => void;
	isActive: boolean;
	openedMenuId: string | null;
	setOpenedMenuId: (id: string | null) => void;
	handleEditChannel: (channel: Channel) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
	channel,
	handleClick,
	isActive,
	openedMenuId,
	setOpenedMenuId,
	handleEditChannel,
}) => {
	// states
	const [hover, setHover] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	// mutations
	const { mutate: leaveChannel } = useLeaveChannel(channel.id);
	const { mutate: deleteChannel } = useDeleteChannel(channel.id);

	// variables
	const canShowMenu =
		channel.permissions.isMember &&
		channel.type !== ChannelType.Direct_message;

	// hooks
	useEffect(() => {
		if (openedMenuId !== channel.id) {
			setShowMenu(false);
		}
	}, [openedMenuId, channel.id]);

	// handlers
	const toggleMenu = () => {
		setOpenedMenuId(channel.id);
		setShowMenu(!showMenu);
	};

	const handleTouchStart = () => {
		setHover(true);
	};

	const handleLeaveChannel = () => {
		leaveChannel();
	};

	const handleDeleteChannel = () => {
		deleteChannel();
	};

	return (
		<li
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onTouchStart={handleTouchStart}
			style={{
				transition: "all 0.2s",
			}}
			className={`hover:bg-astronaut-700 px-2 py-1 ${
				isActive === true ? "bg-astronaut-800" : ""
			}`}
		>
			<div className="flex justify-between items-center cursor-pointer">
				<div className="w-full" onClick={() => handleClick(channel)}>
					{channel.type !== ChannelType.Direct_message
						? channel.name
						: channel.user?.name}
				</div>
				{hover && canShowMenu && (
					<div onClick={toggleMenu} className="w-4 cursor-pointer">
						<FontAwesomeIcon
							icon={showMenu ? faCaretUp : faCaretDown}
						/>
					</div>
				)}
			</div>
			{showMenu && canShowMenu && (
				<ul className="bg-white text-black border rounded shadow-md mt-2">
					{channel.permissions.canModify && (
						<li
							onClick={() => handleEditChannel(channel)}
							className="cursor-pointer hover:bg-gray-200 px-4 py-2"
						>
							Edit
						</li>
					)}
					<li
						onClick={handleLeaveChannel}
						className="cursor-pointer hover:bg-gray-200 px-4 py-2"
					>
						Leave
					</li>
					{channel.permissions.canDelete && (
						<li
							onClick={handleDeleteChannel}
							className="cursor-pointer hover:bg-gray-200 px-4 py-2"
						>
							Delete
						</li>
					)}{" "}
				</ul>
			)}
		</li>
	);
};

export { ChannelItem };
