import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logo42 } from "../../assets/icons/42_logo";
import { logoGoogle } from "../../assets/icons/google_logo";
import { pong_logo } from "../../assets/icons/pong_logo";
import { IconButton } from "../../components/IconButton/IconButton";
import { API_BASE_URL, API_ROUTES } from "../../config";
import { RootState } from "../../types/global";

const Home: React.FC = () => {
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	const login = async (url: string) => {
		if (isAuth) return;

		window.location.href = `${API_BASE_URL}${url}`;
	};

	return (
		<div className="h-full flex flex-col   items-center justify-center">
			{!isAuth && (
				<div className="flex">
					<IconButton
						url={API_ROUTES.AUTH_42}
						name="Login"
						onClick={login}
						logo={logo42()}
					/>
					<IconButton
						url={API_ROUTES.AUTH_GOOGLE}
						name="Login"
						onClick={login}
						logo={logoGoogle()}
					/>
				</div>
			)}
			{isAuth && (
				<Link to="/game">
					<IconButton url="" name="Play" logo={pong_logo()} />
				</Link>
			)}
		</div>
	);
};

export { Home };
