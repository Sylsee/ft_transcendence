import React from "react";

interface UserRowButtonProps {
	color: string;
	name: string;
	handleClick?: () => void;
}

const UserRowButton: React.FC<UserRowButtonProps> = ({
	color,
	name,
	handleClick,
}) => {
	const colorClasses: any = {
		"silver-tree": "bg-silver-tree hover:bg-silver-tree-700",
		astronaut: "bg-astronaut-600 hover:bg-astronaut-700",
		red: "bg-red-600 hover:bg-red-700",
		tamarillo: "bg-tamarillo-600 hover:bg-tamarillo-700",
		"river-bed": "bg-river-bed-600 hover:bg-river-bed-700",
	};

	return (
		<button
			onClick={handleClick}
			className={`${colorClasses[color]} text-white font-bold py-2 px-4 rounded m-1`}
		>
			<span className="ml-1">{name}</span>
		</button>
	);
};

export { UserRowButton };
