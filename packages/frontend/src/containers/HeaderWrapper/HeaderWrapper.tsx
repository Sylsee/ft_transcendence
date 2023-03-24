import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { authenticate } from "../../store/auth-slice/auth-slice";
import { Header } from "../Header/Header";
import { Loader } from "../../components/Loader/Loader";

const HeaderWrapper: React.FC = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		dispatch(authenticate());
		setLoading(false);
	}, [location, dispatch]);

	return (
		<>
			<div className="h-full flex flex-col bg-gradient-custom">
				<Header />
				<div className="h-[95%]">
					{loading && <Loader />}
					{!loading && <Outlet />}
				</div>
			</div>
		</>
	);
};

export { HeaderWrapper };
