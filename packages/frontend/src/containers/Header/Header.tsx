import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderButton } from "components/Header/HeaderButton/HeaderButton";
import { HeaderLink } from "components/Header/HeaderLink/HeaderLink";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "store/auth-slice/auth-slice";
import { AuthStatus } from "types/auth/auth";
import { LobbyState } from "types/game/lobby";
import { RootState } from "types/global/global";
import styles from "./Header.module.css";

const Header: React.FC = () => {
	// state
	const [navbarState, setNavbarState] = useState(false);

	// redux
	const id = useSelector((store: RootState) => store.USER.user?.id);
	const dispatch = useDispatch();
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	const lobbyStatus = useSelector(
		(store: RootState) => store.GAME.lobbyStatus
	);
	// handlers
	const logoutHandler = () => {
		dispatch(logout());
	};

	return (
		<nav className="h-100 relative flex flex-wrap items-center justify-between px-2 py-3 bg-{2E4F4F} lg:px-4 lg:py-4">
			<div className="container max-w-none px-4 m-0 flex flex-wrap items-center justify-between">
				<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
					<div className="flex justify-center items-center">
						<Link
							className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
							to="/"
						>
							Ft_transcendence
						</Link>
						{lobbyStatus === LobbyState.Searching && (
							<Link to="/lobby">
								<div className={`${styles.loader}`}></div>
							</Link>
						)}
					</div>
					{isAuth === AuthStatus.Authenticated && (
						<button
							className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
							type="button"
							onClick={() => setNavbarState(!navbarState)}
						>
							<i className="fas fa-bars"></i>
							<FontAwesomeIcon icon={faBars} />
						</button>
					)}
				</div>
				<div
					className={`lg:flex flex-grow items-center ${
						navbarState ? "flex" : "hidden"
					}`}
					id="example-navbar-danger"
				>
					{isAuth === AuthStatus.Authenticated && id && (
						<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
							<HeaderLink name="Profile" link={`/user/${id}`} />
							<HeaderButton
								onClick={logoutHandler}
								name="Logout"
							/>
						</ul>
					)}
				</div>
			</div>
		</nav>
	);
};

export { Header };
