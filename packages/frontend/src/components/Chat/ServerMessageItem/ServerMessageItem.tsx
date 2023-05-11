import React from "react";

interface ServerMessageItemProps {
	content: string;
}

const ServerMessageItem: React.FC<ServerMessageItemProps> = ({ content }) => {
	return (
		<div className="text-tamarillo-400 italic font-bold min-h-[2rem]">
			{content}
		</div>
	);
};

export { ServerMessageItem };
