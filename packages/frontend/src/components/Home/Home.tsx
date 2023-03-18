import React from "react";
import { logo42 } from "../../assets/icons/42_logo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store-types";
import { authenticate } from "../../store/auth-slice/auth-slice";

const Home: React.FC = () => {
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	const dispatch = useDispatch();

	const login = () => {
		if (isAuth) return;
		dispatch(authenticate({ token: "TOKEN" }));
	};

	return (
		<div className="h-full flex flex-col   items-center justify-center">
			<button
				onClick={login}
				className="p-2 rounded-lg border-2 border-black  flex items-center gap-3 opacity-70 hover:opacity-100"
			>
				<div className="h-7 w-7">{logo42()}</div>
				<p className="text-white">Login</p>
			</button>
		</div>
	);
};

export { Home };
