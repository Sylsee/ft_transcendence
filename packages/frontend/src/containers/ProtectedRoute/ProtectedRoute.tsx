import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { AuthStatus } from "types/auth";
import { RootState } from "types/global";

const ProtectedRoute: React.FC = () => {
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	if (isAuth === AuthStatus.Authenticated)
		return (
			<>
				<Outlet />
			</>
		);
	else return <Navigate to={"/"} />;
};

export { ProtectedRoute };
