import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { authenticate } from "../../store/auth-slice/auth-slice";
import { RootState } from "../../store/store-types";
import { Loader } from "../Loader/Loader";

const Callback: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(authenticate());

		setLoading(false);
	}, [dispatch]);

	if (loading)
		return (
			<>
				<Loader />
			</>
		);

	return isAuth ? <Navigate to={"/user/1"} /> : <Navigate to={"/"} />;
};

export { Callback };
