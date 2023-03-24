import React from "react";
import { logo42 } from "../../assets/icons/42_logo";
import { RootState } from "../../store/store-types";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../config";
import { IconButton } from "../../components/IconButton/IconButton";
import { pong_logo } from "../../assets/icons/pong_logo";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	const login = async () => {
		if (isAuth) return;

		window.location.href = `${BACKEND_URL}/auth/login`;
	};

	return (
		<div className="h-full flex flex-col   items-center justify-center">
			{!isAuth && (
				<IconButton name="Login" onClick={login} logo={logo42()} />
			)}
			{isAuth && (
				<Link to="/game">
					<IconButton name="Play" logo={pong_logo()} />
				</Link>
			)}
		</div>
	);
};

export { Home };
