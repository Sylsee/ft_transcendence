import React, { useEffect, useState } from "react";
import { ChatEvent } from "../../../config";
import { emitSocketEvent } from "../../../sockets/socket";

interface ChatInputProps {
	channelId: string;
	scrollToBottom: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ channelId, scrollToBottom }) => {
	const [message, setMessage] = useState<string | undefined>("");
	const [inputIsValid, setinputIsValid] = useState<boolean>(false);

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
		console.log("message sent", payload);
		emitSocketEvent(ChatEvent.MESSAGE, payload);
		setMessage("");
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	return (
		<form className="flex" onSubmit={(e) => handleFormSubmit(e)}>
			<div className="flex w-full">
				<input
					onChange={(e) => handleInputChange(e)}
					placeholder="Write a message..."
					value={message}
					className="w-full text-black focus:outline-none focus:border-blue-500"
				/>
				{/* <textarea
					onChange={(e) => handleInputChange(e)}
					placeholder="Write a message..."
					value={message}
					className="resize-none w-full px-4 text-black focus:outline-none focus:border-blue-500"
				></textarea> */}
			</div>
			{/* {inputIsValid && (
				<button
					type="submit"
					className="bg-white text-blue-400  hover:text-blue-700  font-bold py-2 px-4"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			)} */}
		</form>
	);
};

export { ChatInput };
