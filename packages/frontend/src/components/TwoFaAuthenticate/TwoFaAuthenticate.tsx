import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuthTwoFa } from "../../hooks/auth/useAuthTwoFa";
import { authenticate, logout } from "../../store/auth-slice/auth-slice";
import { TwoFactorAuthenticationModal } from "../Profile/ProfileCard/Profile2faAuth/TwoFactorAuthenticationModal/TwoFactorAuthenticationModal";

interface TwoFaAuthenticateProps {}

const TwoFaAuthenticate: React.FC<TwoFaAuthenticateProps> = ({}) => {
	// redux
	const dispatch = useDispatch();

	// mutation
	const { mutate, error, status } = useAuthTwoFa();

	const handleSubmit = (code: string) => {
		mutate(code);
	};

	// hooks
	useEffect(() => {
		if (status === "success") {
			dispatch(authenticate());
		}
	}, [status, dispatch]);

	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<div>
			<TwoFactorAuthenticationModal
				title={"Login"}
				showModal={true}
				setShowModal={() => {}}
				handleSubmit={handleSubmit}
				status={status}
				error={error}
				cancelValue={"Logout"}
				handleCancel={logoutHandler}
				displayCancelIcon={false}
			/>
		</div>
	);
};

export { TwoFaAuthenticate };
