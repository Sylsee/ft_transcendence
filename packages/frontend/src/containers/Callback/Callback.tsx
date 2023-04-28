import { Loader } from "components/Loader/Loader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { AuthStatus } from "types/auth/auth";
import { RootState } from "types/global/global";

// TODO twofactor
const Callback: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	const id = useSelector((store: RootState) => store.USER.user?.id);

	useEffect(() => {
		if (
			isAuth === AuthStatus.NotAuthenticated ||
			isAuth === AuthStatus.PartiallyAuthenticated
		)
			setLoading(false);
		if (isAuth === AuthStatus.Authenticated && id !== undefined)
			setLoading(false);
	}, [isAuth, id]);

	if (loading)
		return (
			<>
				<Loader />
			</>
		);

	return isAuth === AuthStatus.Authenticated ? (
		<Navigate to={`/user/${id}`} />
	) : (
		<Navigate to={"/"} />
	);
};

export { Callback };
