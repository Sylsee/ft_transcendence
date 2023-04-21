import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import { TwoFaAuthenticate } from "../../components/TwoFaAuthenticate/TwoFaAuthenticate";
import { authenticate } from "../../store/auth-slice/auth-slice";
import { AuthStatus } from "../../types/auth";
import { RootState } from "../../types/global";
import { Header } from "../Header/Header";

const HeaderWrapper: React.FC = () => {
	// state
	const [loading, setLoading] = useState(true);

	// react-router
	const location = useLocation();

	// redux
	const dispatch = useDispatch();
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	useEffect(() => {
		dispatch(authenticate());
		setLoading(false);
	}, [location, dispatch]);

	return (
		<>
			<div
				className="h-full flex flex-col bg-gradient-custom"
				style={{ backgroundColor: "#d18080" }}
			>
				<Header />
				<div className="h-[100%]">
					{loading && <Loader />}
					{!loading &&
						(isAuth === AuthStatus.PartiallyAuthenticated ? (
							<TwoFaAuthenticate />
						) : (
							<Outlet />
						))}
				</div>
			</div>
		</>
	);
};

export { HeaderWrapper };
