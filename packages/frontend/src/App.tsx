import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./containers/Home/Home";
import { Profile } from "./containers/Profile/Profile";
import { HeaderWrapper } from "./containers/HeaderWrapper/HeaderWrapper";
import "./index.css";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { ProtectedRoute } from "./containers/ProtectedRoute/ProtectedRoute";
import { Callback } from "./containers/Callback/Callback";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HeaderWrapper />,
		errorElement: <ErrorPage />,
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
				element: <ErrorPage />,
			},
		],
	},
]);

const App: React.FC = () => {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export { App };
