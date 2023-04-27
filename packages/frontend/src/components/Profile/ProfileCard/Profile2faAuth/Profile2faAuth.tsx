import React, { useEffect, useState } from "react";
import { useToggleTwoFa } from "../../../../hooks/auth/useToggleTwoFa";
import { TwoFactorAuthenticationModal } from "./TwoFactorAuthenticationModal/TwoFactorAuthenticationModal";
import { TwoFaQrCode } from "./TwoFactorAuthenticationModal/TwoFaQrCode/TwoFaQrCode";

interface Profile2faAuthProps {
	id: string;
	isTwoFactorAuthEnabled: boolean;
}

const Profile2faAuth: React.FC<Profile2faAuthProps> = ({
	id,
	isTwoFactorAuthEnabled,
}) => {
	// state
	const [showModal, setShowModal] = useState<boolean>(false);

	// mutation
	const { mutate, error, status } = useToggleTwoFa(isTwoFactorAuthEnabled);

	// handlers
	const handleToggleChange = () => {
		setShowModal(true);
	};

	const handleSubmit = (code: string): void => {
		mutate(code);
	};

	useEffect(() => {
		if (status === "success") {
			setShowModal(false);
		}
	}, [status]);

	return (
		<div className="flex justify-start">
			<span className="mr-4">2fa:</span>
			<label className="relative inline-flex items-center mr-5 cursor-pointer">
				<input
					type="checkbox"
					value=""
					className="sr-only peer"
					onChange={handleToggleChange}
					checked={isTwoFactorAuthEnabled}
				/>
				<div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
			</label>

			<TwoFactorAuthenticationModal
				title={isTwoFactorAuthEnabled ? "Disable" : "Enable"}
				showModal={showModal}
				setShowModal={setShowModal}
				handleSubmit={handleSubmit}
				status={status}
				error={error}
			>
				{!isTwoFactorAuthEnabled ? <TwoFaQrCode /> : null}
			</TwoFactorAuthenticationModal>
		</div>
	);
};

export { Profile2faAuth };
