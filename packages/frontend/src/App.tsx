import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorNotFound } from "./components/Error/ErrorNotFound";
import { Callback } from "./containers/Callback/Callback";
import { HeaderWrapper } from "./containers/HeaderWrapper/HeaderWrapper";
import { Home } from "./containers/Home/Home";
import { Profile } from "./containers/Profile/Profile";
import { ProtectedRoute } from "./containers/ProtectedRoute/ProtectedRoute";
import "./index.css";
import {
	removeSocketChatListeners,
	socketChatListeners,
} from "./sockets/listeners/chatListeners";
import { connectSocket } from "./sockets/socket";
import { RootState } from "./types/global";

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
	const access_token = useSelector((store: RootState) => store.AUTH.token);
	const dispatch = useDispatch();
	useEffect(() => {
		if (!access_token) return;
		connectSocket(access_token);
		socketChatListeners(dispatch);
		return () => {
			removeSocketChatListeners();
		};
	}, [access_token, dispatch]);

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={true} />
			</QueryClientProvider>
		</>
	);
};

export { App };
