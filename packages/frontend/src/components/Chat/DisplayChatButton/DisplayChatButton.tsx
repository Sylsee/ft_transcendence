import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface DisplayChatButtonProps {
	handleClick: () => void;
	customClass: string;
}

const DisplayChatButton: React.FC<DisplayChatButtonProps> = ({
	handleClick,
	customClass,
}) => {
	return (
		<button
			type="button"
			className={`text-white hover:bg-gun-powder bg-tuna font-medium text-sm text-center bottom-4 right-4 ${customClass} rounded-full p-4 shadow-lg  absolute`}
			onClick={handleClick}
		>
			<FontAwesomeIcon icon={faMessage} />
		</button>
	);
};

export { DisplayChatButton };
