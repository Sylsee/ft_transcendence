import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";

const HeaderWrapper: React.FC = () => {
	return (
		<div className="h-full flex flex-col bg-gradient-custom">
			<Header />
			<div className="h-[95%]">
				<Outlet />
			</div>
		</div>
	);
};

export { HeaderWrapper };
