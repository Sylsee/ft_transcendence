import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Profile } from "./components/Profile/Profile";
import { HeaderWrapper } from "./components/HeaderWrapper/HeaderWrapper";
import "./index.css";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

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

export default App;
