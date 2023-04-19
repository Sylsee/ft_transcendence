import React from "react";

interface ChannelItemProps {
	id: string;
	name: string;
	handleClick: (channelId: string) => void;
	isActive: boolean;
}

const ChannelItem: React.FC<ChannelItemProps> = ({
	id,
	name,
	handleClick,
	isActive,
}) => {
	return (
		<li
			onClick={() => handleClick(id)}
			className={`cursor-pointer hover:bg-orange-200 px-2 py-1 ${
				isActive === true ? "bg-orange-200" : ""
			}`}
		>
			{name}
		</li>
	);
};

export { ChannelItem };
