import React from "react";

interface ChatMenuButtonProps {
	handleClick: () => void;
	name: string;
	isSelected: boolean;
}

const ChatMenuButton: React.FC<ChatMenuButtonProps> = ({
	handleClick,
	name,
	isSelected,
}) => {
	return (
		<button
			onClick={handleClick}
			className="flex flex-col w-1/2 justify-center pb-1 items-center md:text-2xl"
		>
			{name}
			<div className={`h-[2px] w-2/5 ${isSelected && "bg-white"}`}></div>
		</button>
	);
};

export { ChatMenuButton };
