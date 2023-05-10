import { TwoFactorAuthenticationModal } from "components/Profile/ProfileCard/Profile2faAuth/TwoFactorAuthenticationModal/TwoFactorAuthenticationModal";
import { useAuthTwoFa } from "hooks/auth/useAuthTwoFa";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authenticate, logout } from "store/auth-slice/auth-slice";

interface TwoFaAuthenticateProps {}

const TwoFaAuthenticate: React.FC<TwoFaAuthenticateProps> = () => {
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
