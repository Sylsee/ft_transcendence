import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../types/global";

const ProtectedRoute: React.FC = () => {
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	return isAuth ? (
		<>
			<Outlet />
		</>
	) : (
		<Navigate to={"/"} />
	);
};

export { ProtectedRoute };
