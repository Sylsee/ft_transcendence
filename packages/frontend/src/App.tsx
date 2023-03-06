import React from "react";
import { Header } from "./components/Header/Header";
import "./index.css";

function App() {
	const message = "Hesllo World !";

	return (
		<div className="bg-gray-900 h-screen">
			<Header />
			<h1 className="text-4xl font-bold underline text-red-600">
				{message}
			</h1>
		</div>
	);
}

export default App;
