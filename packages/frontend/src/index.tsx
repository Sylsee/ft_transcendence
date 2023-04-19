import { ThemeProvider } from "@material-tailwind/react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { App } from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "@material-tailwind/react";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<ThemeProvider>
			<ToastContainer />
			<App />
		</ThemeProvider>
	</Provider>
	// {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
