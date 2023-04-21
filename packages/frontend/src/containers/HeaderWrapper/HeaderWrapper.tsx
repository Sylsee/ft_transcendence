import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

	// Etat pour afficher le chat en mode modal
	const [showModal, setshowModal] = useState(false);

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
						) : (
							<TwoFaAuthenticate />
							<Outlet />
						))}
				</div>
				{isAuth && (
					<ChatWrapper
						showModal={showModal}
						setShowModal={setshowModal}
					/>
				)}
			</div>
			{!showModal && (
				<button
					type="button"
					className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium text-sm text-center fixed bottom-4 right-4 lg:hidden bg-blue-500 rounded-full p-4 shadow-lg"
					onClick={() => setshowModal(true)}
				>
					<FontAwesomeIcon icon={faMessage} />
				</button>
			)}
		</div>
	);
};

export { HeaderWrapper };
