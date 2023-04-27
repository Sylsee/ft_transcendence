import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorNotFound } from "components/Error/ErrorNotFound";
import { TwoFaAuthenticate } from "components/TwoFaAuthenticate/TwoFaAuthenticate";
import { Callback } from "containers/Callback/Callback";
import { HeaderWrapper } from "containers/HeaderWrapper/HeaderWrapper";
import { Home } from "containers/Home/Home";
import { Profile } from "containers/Profile/Profile";
import { ProtectedRoute } from "containers/ProtectedRoute/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
	removeSocketChatListeners,
	socketChatListeners,
} from "sockets/listeners/chatListeners";
import { connectSocket } from "sockets/socket";
import { AuthStatus } from "types/auth";
import { RootState } from "types/global";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HeaderWrapper />,
		errorElement: <ErrorNotFound />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/callback",
				element: <Callback />,
			},
			{
				path: "/auth/2fa",
				element: <TwoFaAuthenticate />,
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: "/user/:id",
						element: <Profile />,
					},
					{
						path: "/user/edit",
						element: <Profile />,
					},
				],
			},
			{
				path: "*",
				element: <ErrorNotFound />,
			},
		],
	},
]);

const queryClient = new QueryClient();

const App: React.FC = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector((state: RootState) => state.AUTH.isAuth);
	useEffect(() => {
		if (isAuth !== AuthStatus.Authenticated) return;

		connectSocket();
		socketChatListeners(dispatch);
		return () => {
			removeSocketChatListeners();
		};
	}, [dispatch, isAuth]);

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ToastContainer />
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={true} />
			</QueryClientProvider>
		</>
	);
};

export { App };
