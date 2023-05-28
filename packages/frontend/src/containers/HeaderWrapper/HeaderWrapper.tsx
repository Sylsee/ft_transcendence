import { DisplayChatButton } from "components/Chat/DisplayChatButton/DisplayChatButton";
import { Loader } from "components/Loader/Loader";
import { ChatWrapper } from "containers/ChatWrapper/ChatWrapper";
import { Header } from "containers/Header/Header";
import { ToastManager } from "containers/ToastManager/ToastManager";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { authenticate } from "store/auth-slice/auth-slice";
import { setShowChat, setShowChatModal } from "store/chat-slice/chat-slice";
import { AuthStatus } from "types/auth/auth";
import { RootState } from "types/global/global";

const HeaderWrapper: React.FC = () => {
	// state
	const [loading, setLoading] = useState(true);

	// react-router
	const location = useLocation();

	// redux
	const dispatch = useDispatch();
	const isAuth = useSelector((store: RootState) => store.AUTH.isAuth);
	const showModal = useSelector((store: RootState) => store.CHAT.showModal);
	const showChat = useSelector((store: RootState) => store.CHAT.showChat);

	// hooks
	useEffect(() => {
		dispatch(authenticate());
		setLoading(false);
	}, [location, dispatch]);

	// handlers
	const handleShowChatModal = (value: boolean) => {
		dispatch(setShowChatModal(value));
	};

	const handleShowChat = (value: boolean) => {
		dispatch(setShowChat(value));
	};

	return (
		<div className="h-full flex flex-col max-h-full bg-background-gradient">
			<div className="flex-shrink-0">
				<Header />
			</div>
			<div className="flex justify-between  max-h-full overflow-auto h-full">
				<div className="flex flex-grow overflow-auto">
					{loading ? <Loader /> : <Outlet />}
				</div>
				{isAuth === AuthStatus.Authenticated && (
					<ChatWrapper
						showModal={showModal}
						setShowModal={handleShowChatModal}
					/>
				)}
			</div>
			{!showModal && isAuth === AuthStatus.Authenticated && (
				<DisplayChatButton
					handleClick={() => handleShowChatModal(true)}
					customClass={"xl:hidden"}
				/>
			)}
			{!showChat && isAuth === AuthStatus.Authenticated && (
				<DisplayChatButton
					handleClick={() => handleShowChat(true)}
					customClass={"hidden xl:block"}
				/>
			)}
			<ToastManager />
		</div>
	);
};

export { HeaderWrapper };
