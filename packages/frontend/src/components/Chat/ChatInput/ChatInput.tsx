import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatEvent } from "config";
import { useEffect, useRef, useState } from "react";
import { emitChatSocketEvent } from "sockets/socket";

interface ChatInputProps {
	channelId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ channelId }) => {
	// states
	const [message, setMessage] = useState<string | undefined>("");
	const [inputIsValid, setinputIsValid] = useState<boolean>(false);

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
		setMessage(e.target.value);
		setinputIsValid(
			e.target.value.length >= 1 && e.target.value.length <= 1000
		);
	};
	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputIsValid) return;

		const payload = { channelId, content: message };
		emitChatSocketEvent(ChatEvent.Message, payload);
		setMessage("");
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
			{inputIsValid && (
				<button
					type="submit"
					className="bg-white hover:text-astronaut-500  text-astronaut-400  font-bold py-2 px-4"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			)}
		</form>
	);
};

export { ChatInput };
