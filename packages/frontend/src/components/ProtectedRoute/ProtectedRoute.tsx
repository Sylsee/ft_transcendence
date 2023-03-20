import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../store/store-types";

const ProtectedRoute: React.FC = () => {
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	useEffect(() => {
		// check date of jwt token in cookies
		// if expired, remove it
	}, []);
	return isAuth ? (
		<>
			<Outlet />
		</>
	) : (
		<Navigate to={"/"} />
	);
};

export { ProtectedRoute };
