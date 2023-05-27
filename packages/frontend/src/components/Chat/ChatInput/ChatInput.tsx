import { ReactComponent as SendArrow } from "assets/icons/chat/send-arrow.svg";
import { ChatEvent } from "config";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emitChatSocketEvent } from "sockets/socket";
import { setChatInput } from "store/chat-slice/chat-slice";
import { RootState } from "types/global/global";

interface ChatInputProps {
	channelId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ channelId }) => {
	const dispatch = useDispatch();

	// states
	const message = useSelector((store: RootState) => store.CHAT.chatInput);

	// ref
	const inputRef = useRef<HTMLInputElement>(null);

	// hooks
	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, [channelId, inputRef]);

	//	handlers
	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement> | any
	) => {
		dispatch(setChatInput(e.target.value));
	};
	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const payload = { channelId, content: message };
		emitChatSocketEvent(ChatEvent.Message, payload);
		dispatch(setChatInput(""));
	};

	return (
		<form
			className="flex flex-grow rounded-3xl items-end bg-gun-powder"
			onSubmit={(e) => handleFormSubmit(e)}
		>
			<input
				ref={inputRef}
				onChange={(e) => handleInputChange(e)}
				placeholder="Write a message..."
				value={message}
				style={{ wordWrap: "break-word", wordBreak: "break-word" }}
				className="flex rounded-3xl items-center w-full py-4 pl-5 text-athens-gray text-[15px] focus:outline-none bg-gun-powder"
			/>
			<button type="submit" className="h-full py-1.5 px-3 pr-5">
				<SendArrow />
			</button>
		</form>
	);
};

export { ChatInput };
