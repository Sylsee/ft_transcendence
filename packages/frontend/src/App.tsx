import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorNotFound } from "./components/Error/ErrorNotFound";
import { TwoFaAuthenticate } from "./components/TwoFaAuthenticate/TwoFaAuthenticate";
import { Callback } from "./containers/Callback/Callback";
import { HeaderWrapper } from "./containers/HeaderWrapper/HeaderWrapper";
import { Home } from "./containers/Home/Home";
import { Profile } from "./containers/Profile/Profile";
import { ProtectedRoute } from "./containers/ProtectedRoute/ProtectedRoute";
import "./index.css";

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
