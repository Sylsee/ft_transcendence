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
			className={`flex flex-col w-1/2 justify-center pb-2 items-center text-lg md:text-2xl ${
				!isSelected ? "text-[#8E8EA0]" : "text-[#D9D9E3]"
			}`}
		>
			{name}
			<div
				className={`h-[2px] w-2/5 ${isSelected && "bg-[#D9D9E3]"}`}
			></div>
		</button>
	);
};

export { ChatMenuButton };
