import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HeaderLink } from "./HeaderLink/HeaderLink";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store-types";

const Header: React.FC = () => {
	const [navbarState, setNavbarState] = useState(false);
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	return (
		<nav className="min-h-[5%] relative flex flex-wrap items-center justify-between px-2 py-3 bg-{2E4F4F} lg:px-4 lg:py-4">
			<div className="container max-w-none px-4 m-0 flex flex-wrap items-center justify-between">
				<div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
					<Link
						className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
						to="/"
					>
						Ft_transcendence
					</Link>
					{isAuth && (
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
					{isAuth && (
						<ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
							<HeaderLink name="Chat" link="/chat" />
							<HeaderLink name="Profile" link="/user/1" />
							<HeaderLink name="Logout" link="/logout" />
						</ul>
					)}
				</div>
			</div>
		</nav>
	);
};

export { Header };
