import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
		<form className="flex" onSubmit={(e) => handleFormSubmit(e)}>
			<div className="flex w-full">
				<input
					ref={inputRef}
					onChange={(e) => handleInputChange(e)}
					placeholder="Write a message..."
					value={message}
					className="w-full p-4 text-black focus:outline-none focus:border-blue-500"
				/>
			</div>
			<button
				type="submit"
				className="bg-white hover:text-astronaut-500  text-astronaut-400  font-bold py-2 px-4"
			>
				<FontAwesomeIcon icon={faPaperPlane} />
			</button>
		</form>
	);
};

export { ChatInput };
