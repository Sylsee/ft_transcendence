import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDeleteChannel } from "hooks/chat/useDeleteChannel";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Channel, ChannelType } from "types/chat/chat";

interface ChannelItemProps {
	channel: Channel;
	handleClick: (channel: Channel) => void;
	isActive: boolean;
	openedMenuId: string | null;
	setOpenedMenuId: (id: string | null) => void;
	handleEditChannel: (channel: Channel) => void;
	handleLeaveChannel: (channel: Channel) => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
	channel,
	handleClick,
	isActive,
	openedMenuId,
	setOpenedMenuId,
	handleEditChannel,
	handleLeaveChannel,
}) => {
	// states
	const [hover, setHover] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	// redux
	const dispatch = useDispatch();

	// mutations
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
			{true && (
				<ul className="bg-white text-black border rounded shadow-md mt-2">
					{channel.permissions.canModify && (
						<li
							onClick={() => handleEditChannel(channel)}
							className="cursor-pointer hover:bg-gray-200 px-4 py-2"
						>
							Edit
						</li>
					)}
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
