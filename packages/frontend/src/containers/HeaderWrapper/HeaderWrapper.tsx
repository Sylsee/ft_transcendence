import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import { authenticate } from "../../store/auth-slice/auth-slice";
import { RootState } from "../../types/global";
import { ChatWrapper } from "../ChatWrapper/ChatWrapper";
import { Header } from "../Header/Header";

const HeaderWrapper: React.FC = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);

	useEffect(() => {
		dispatch(authenticate());
		setLoading(false);
	}, [location, dispatch]);

	// Etat pour afficher le chat en mode modal
	const [showModal, setshowModal] = useState(false);

	return (
		<div
			className="h-full flex flex-col items-stretch max-h-full"
			style={{
				backgroundColor: "#424549",
				backgroundAttachment: "fixed",
			}}
		>
			<div className="flex-shrink-0">
				<Header />
			</div>
			<div className="flex  justify-between items-stretch max-h-full  overflow-auto h-full">
				<div className="w-full">
					{loading ? <Loader /> : <Outlet />}
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
