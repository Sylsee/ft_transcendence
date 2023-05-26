import React from "react";
import { ModalButtonType } from "types/button/button";

interface ModalButtonProps {
	name: string;
	type?: "button" | "submit" | "reset" | undefined;
	buttonType: ModalButtonType;
	handleClick?: () => void;
}

const ModalButton: React.FC<ModalButtonProps> = ({
	name,
	type = "button",
	buttonType,
	handleClick,
}) => {
	const colorClasses: { [key in ModalButtonType]?: string } = {
		[ModalButtonType.Accept]:
			"bg-silver-tree-400 hover:bg-silver-tree-700 text-white",
		[ModalButtonType.Cancel]: "text-tamarillo-700",
		[ModalButtonType.Critical]:
			"bg-tamarillo-400 hover:bg-tamarillo-700 text-white",
	};

	return (
		<button
			onClick={handleClick}
			className={`${colorClasses[buttonType]} font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
			type={type}
		>
			{name}
		</button>
	);
};

export { ModalButton };
