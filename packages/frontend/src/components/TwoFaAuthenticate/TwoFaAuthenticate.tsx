import { TwoFactorAuthenticationModal } from "components/Profile/ProfileCard/Profile2faAuth/TwoFactorAuthenticationModal/TwoFactorAuthenticationModal";
import { useAuthTwoFa } from "hooks/auth/useAuthTwoFa";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authenticate, logout } from "store/auth-slice/auth-slice";
import { AuthStatus } from "types/auth/auth";
import { RootState } from "types/global/global";

interface TwoFaAuthenticateProps {}

const TwoFaAuthenticate: React.FC<TwoFaAuthenticateProps> = () => {
	// redux
	const dispatch = useDispatch();
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

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

	if (isAuth !== AuthStatus.PartiallyAuthenticated)
		return <Navigate to={"/"} />
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
