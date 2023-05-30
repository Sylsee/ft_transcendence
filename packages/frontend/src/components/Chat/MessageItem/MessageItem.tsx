import { useCreateChannel } from "hooks/chat/useCreateChannel";
import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	selectDirectMessageChannel,
	setActiveChannel,
	setShowChatModal,
} from "store/chat-slice/chat-slice";
import { setActiveTooltip } from "store/toolTip-slice/toolTip-slice";
import { ChannelType, Message } from "types/chat/chat";
import { RootState } from "types/global/global";
interface MessageItemProps {
	message: Message;
	isConnectedUser: boolean;
	isSameSenderAsPrevious: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
	message,
	isConnectedUser,
	isSameSenderAsPrevious,
}) => {
	// states
	const [referenceElement, setReferenceElement] =
		useState<HTMLSpanElement | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
		null
	);
	const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(
		null
	);

	// mutation
	const {
		mutate: createChannelMutate,
		status: createChannelStatus,
		error: createChannelError,
	} = useCreateChannel();

	// redux
	const dispatch = useDispatch();
	const activeToolTip = useSelector(
		(state: RootState) => state.TOOLTIP.activeTooltip
	);
	const directMessageChannel = useSelector((state: RootState) =>
		selectDirectMessageChannel(state, message.sender.id)
	);
	const connected_user_id = useSelector(
		(state: RootState) => state.USER.user?.id
	);

	// tooltip
	const showTooltip = activeToolTip === message.id;
	const toggleTooltip = () => {
		if (showTooltip) {
			dispatch(setActiveTooltip(null));
		} else {
			dispatch(setActiveTooltip(message.id));
		}
	};

	// react-rooter
	const navigate = useNavigate();

	// hooks
	useEffect(() => {
		if (createChannelStatus === "error")
			toast.error(`${createChannelError.message}`);
	}, [createChannelStatus, createChannelError]);

	useEffect(() => {
		if (!showTooltip) return;

		const handleClickOutside = (e: Event) => {
			if (!(e.target instanceof HTMLElement)) return;
			if (
				referenceElement?.contains(e.target) ||
				popperElement?.contains(e.target)
			) {
				return;
			}
			dispatch(setActiveTooltip(null));
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [showTooltip, referenceElement, popperElement, dispatch]);

	// popper hook
	const { styles, attributes, state } = usePopper(
		referenceElement,
		popperElement,
		{
			modifiers: [
				{ name: "arrow", options: { element: arrowElement } },
				{ name: "offset", options: { offset: [0, 10] } },
				{
					name: "flip",
					options: { fallbackPlacements: ["top", "bottom"] },
				},
			],
		}
	);

	const arrowStyle = state?.placement.startsWith("top")
		? "-bottom-2.5 h-0 w-0 border-x-8 border-x-transparent border-t-[12px] border-t-shark"
		: "-top-2.5 h-0 w-0 border-x-8 border-x-transparent border-b-[12px] border-b-shark";

	// handlers
	const handleClickMessage = () => {
		if (directMessageChannel) {
			dispatch(setActiveChannel(directMessageChannel.id));
		} else {
			createChannelMutate({
				type: ChannelType.Direct_message,
				otherUserId: message.sender.id,
			});
		}
	};

	const handleClickProfile = () => {
		navigate(`/user/${message.sender.id}`, { replace: true });
		dispatch(setShowChatModal(false));
	};

	return (
		<div
			className={`flex justify-start items-end pb-1 ${
				!isSameSenderAsPrevious && "pt-2"
			} ${isConnectedUser && "flex-row-reverse"}`}
		>
			{/* User profile picture */}

			<div className="w-12">
				{!isSameSenderAsPrevious && (
					<img
						src={message.sender.profilePictureUrl}
						referrerPolicy="no-referrer"
						alt="Avatar"
						className="object-cover rounded-full w-10 h-10 mb-1"
					/>
				)}
			</div>

			{/* Message */}
			<div
				className={`flex flex-col ${
					isConnectedUser ? "items-end mr-2" : "items-start ml-2"
				} max-w-[calc(100%-120px)]`}
			>
				{/* User name */}
				{!isSameSenderAsPrevious && (
					<div
						className={`${
							isConnectedUser
								? "text-right pr-3"
								: "text-left pl-3"
						} w-full`}
					>
						<span
							ref={setReferenceElement}
							onClick={() => toggleTooltip()}
							className="text-xs font-semibold text-white cursor-pointer hover:underline  pb-1 text-center"
						>
							{message.sender.name}
						</span>
					</div>
				)}
				{/* Message content */}
				<div
					style={{ wordWrap: "break-word", wordBreak: "break-word" }}
					className={`flex items-center justify-center  h-full rounded-xl ${
						isConnectedUser ? "bg-silver-tree-700" : "bg-mako"
					}`}
				>
					{showTooltip && (
						<div
							id="dropdown"
							ref={setPopperElement}
							style={styles.popper}
							{...attributes.popper}
							className="bg-shark p-2 rounded shadow-md"
						>
							<div
								ref={setArrowElement}
								style={styles.arrow}
								className={arrowStyle}
							></div>
							<div className="flex flex-col">
								<button
									onClick={handleClickProfile}
									className="text-sm p-1 text-blue-shark hover:text-gun-powder-600"
								>
									Profile
								</button>
								{connected_user_id &&
									connected_user_id !== message.sender.id && (
										<button
											onClick={handleClickMessage}
											className="text-sm p-1 text-blue-shark hover:text-gun-powder-600"
										>
											Message
										</button>
									)}
							</div>
						</div>
					)}
					<p className="text-[15px] text-athens-gray px-3 py-1.5">
						{message.content}
					</p>
				</div>
			</div>
		</div>
	);
};

export { MessageItem };
