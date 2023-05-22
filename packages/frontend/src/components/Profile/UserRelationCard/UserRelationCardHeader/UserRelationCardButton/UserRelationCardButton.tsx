import { IconProp, RotateProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface UserRelationCardButtonProps {
	isActive: boolean;
	handleClick: () => void;
	icon: IconProp;
	rotation?: RotateProp;
}

const UserRelationCardButton: React.FC<UserRelationCardButtonProps> = ({
	isActive,
	handleClick,
	icon,
	rotation = undefined,
}) => {
	return (
		<button
			onClick={handleClick}
			className="grow flex flex-col min-w-1/4 justify-center p-4"
		>
			<FontAwesomeIcon
				icon={icon}
				size="xl"
				className="w-full"
				rotation={rotation}
			/>
			<div className="w-full flex justify-center">
				<div
					className={`h-[2px] w-1/2 ${isActive && "bg-white"} mt-2`}
				></div>
			</div>
		</button>
	);
};

export { UserRelationCardButton };
