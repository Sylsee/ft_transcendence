import React from "react";

interface ModalButtonProps {
	name: string;
	textColor: string;
	backgroundColor: string;
	type?: "button" | "submit" | "reset" | undefined;
}

const ModalButton: React.FC<ModalButtonProps> = ({
	name,
	backgroundColor,
	textColor,
	type,
}) => {
	return (
		<button
			className="bg-tamarillo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
			type={type}
		>
			{name}
		</button>
	);
};

export { ModalButton };
