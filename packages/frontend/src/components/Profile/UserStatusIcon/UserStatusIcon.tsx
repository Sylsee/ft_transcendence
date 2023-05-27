import { ReactComponent as ControllerIcon } from "assets/icons/user/game-controller-icon.svg";
import React from "react";
import { UserStatus } from "types/user/user";

interface UserStatusIconProps {
	status: UserStatus | undefined;
	customStatusStyles?: string;
	customControllerStyles?: string;
}

const UserStatusIcon: React.FC<UserStatusIconProps> = ({
	status,
	customStatusStyles = "bottom-3 right-6",
	customControllerStyles = "bottom-2 right-7",
}) => {
	if (status === undefined) return null;

	if (status === UserStatus.Offline || status === UserStatus.Online) {
		return (
			<div
				className={`absolute ${customStatusStyles} w-3 h-3 ${
					status === UserStatus.Online
						? "bg-silver-tree"
						: "bg-gray-500"
				} border-2 border-white rounded-full`}
			></div>
		);
	} else if (status === UserStatus.InGame) {
		return (
			<div
				className={`absolute ${customControllerStyles} w-3 h-3 text-river-bed-900`}
			>
				<ControllerIcon className="w-4 h-4" />
			</div>
		);
	}
	return null;
};

export { UserStatusIcon };
