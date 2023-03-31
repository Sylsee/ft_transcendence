import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../types/global";
import { Loader } from "../../components/Loader/Loader";

const Callback: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	const id = useSelector((store: RootState) => store.USER.user?.id);

	useEffect(() => {
		if (isAuth === false) setLoading(false);
		if (isAuth === true && id !== undefined) setLoading(false);
	}, [isAuth, id]);

	if (loading)
		return (
			<>
				<Loader />
			</>
		);

	return isAuth ? <Navigate to={`/user/${id}`} /> : <Navigate to={"/"} />;
};

export { Callback };
