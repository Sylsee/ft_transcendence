import React from "react";

interface ModalHeaderProps {
	title: string;
	displayCancelIcon?: boolean;
	handleCancel: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
	title,
	displayCancelIcon,
	handleCancel,
}) => {
	return (
		<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
			<h3 className="text-3xl font-semibold">{title}</h3>
			{displayCancelIcon && (
				<button
					className="p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
					onClick={() => {
						handleCancel();
					}}
				>
					<span className="bg-transparenth-6 w-6 text-2xl text-gray-500 hover:text-black  block outline-none focus:outline-none">
						×
					</span>
				</button>
			)}
		</div>
	);
};

export { ModalHeader };
