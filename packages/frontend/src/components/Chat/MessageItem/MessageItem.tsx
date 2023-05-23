import { useCreateChannel } from "hooks/chat/useCreateChannel";
import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	selectDirectMessageChannel,
	setActiveChannel,
} from "store/chat-slice/chat-slice";
import { setActiveTooltip } from "store/toolTip-slice/toolTip-slice";
import { ChannelType, Message } from "types/chat/chat";
import { RootState } from "types/global/global";

interface MessageItemProps {
	message: Message;
	isConnectedUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
	message,
	isConnectedUser,
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
		? "-bottom-2.5 h-0 w-0 border-x-8 border-x-transparent border-t-[12px] border-t-white"
		: "-top-2.5 h-0 w-0 border-x-8 border-x-transparent border-b-[12px] border-b-white";

	// functions
	const formatDate = (timestamp: Date): string => {
		const date = new Date(timestamp);
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");

		return `${month}/${day}/${year} ${hours}:${minutes}`;
	};

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
	};

	return (
		<div className="flex justify-start items-end py-2">
			{/* User profile picture */}
			<img
				src={`${message.sender.profilePictureUrl}`}
				onClick={() => toggleTooltip()}
				referrerPolicy="no-referrer"
				alt="Avatar"
				className="object-cover rounded-full w-10 h-10 mb-1 cursor-pointer hover:opacity-80"
			/>

			{/* Message */}
			<div className="flex flex-col items-start ml-2 max-w-[calc(100%-6rem)]">
				{/* User name */}
				<span
					ref={setReferenceElement}
					onClick={() => toggleTooltip()}
					className="text-xs font-semibold text-white cursor-pointer hover:underline pl-3 pb-1"
				>
					{message.sender.name}
				</span>
				{/* Message content */}
				<div
					style={{ wordWrap: "break-word", wordBreak: "break-word" }}
					className="flex items-center justify-center bg-chatgpt-grey-50 w-full h-full rounded-2xl"
				>
					<p className="text-[15px] text-chatgpt-grey-100 px-3 py-1.5">
						{message.content}
					</p>
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div className="flex items-start space-x-4 p-2 break-words border-2 border-purple-600">
	// 		<div className="w-[calc(100%-0.5rem)] border-2">
	// 			<div className="text-gray-500">
	// 				{/* User name */}
	// 				<span
	// 					ref={setReferenceElement}
	// 					onClick={() => toggleTooltip()}
	// 					style={{ color: "#c7b99b" }}
	// 					className="font-semibold text-white cursor-pointer hover:underline"
	// 				>
	// 					{message.sender.name}
	// 				</span>
	// 				{/* User name interaction */}
	// 				{/* TODO: refactor it with ul li and add text to the icon */}

	//				{showTooltip && (
	//					<div
	//						ref={setPopperElement}
	//						style={styles.popper}
	//						{...attributes.popper}
	//						className="z-10 flex flex-col justify-center items-center space-y-2 bg-gray-800 rounded-md shadow-md"
	//					>
	//						<div className="flex flex-col justify-center items-center space-y-2">
	//							<button
	//								onClick={() => handleClickProfile()}
	//								className="flex justify-center items-center w-full px-2 py-1 text-sm text-white rounded-md hover:bg-gray-700"
	//							>
	//								Profile
	//							</button>
	//							<button
	//								onClick={() => handleClickMessage()}
	//								className="flex justify-center items-center w-full px-2 py-1 text-sm text-white rounded-md hover:bg-gray-700"
	//							>
	//								Message
	//							</button>
	//						</div>
	//					</div>
	//				)}

	// 				{showTooltip && (
	// 					<div
	// 						id="dropdown"
	// 						ref={setPopperElement}
	// 						style={styles.popper}
	// 						{...attributes.popper}
	// 						className="bg-white p-2 rounded shadow borde"
	// 					>
	// 						<div
	// 							ref={setArrowElement}
	// 							style={styles.arrow}
	// 							className={arrowStyle}
	// 						></div>
	// 						<button
	// 							onClick={handleClickProfile}
	// 							className="text-sm p-1 text-blue-gray-800 hover:text-blue-gray-900"
	// 						>
	// 							<FontAwesomeIcon icon={faUser} />
	// 						</button>
	// 						{connected_user_id &&
	// 							connected_user_id !== message.sender.id && (
	// 								<button
	// 									onClick={handleClickMessage}
	// 									className="text-sm p-1 text-blue-gray-800 hover:text-blue-gray-900"
	// 								>
	// 									<FontAwesomeIcon icon={faMessage} />
	// 								</button>
	// 							)}
	// 					</div>
	// 				)}
	// 				{/* Message time */}
	// 				<span className="ml-2">
	// 					{formatDate(message.timestamp)}
	// 				</span>
	// 			</div>
	// 			{/* Message content */}
	// 			<div className="text-gray-200">{message.content}</div>
	// 		</div>
	// 	</div>
	// );
};

export { MessageItem };
