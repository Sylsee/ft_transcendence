import React from "react";
import "./index.css";

import { Header } from "./components/Header/Header";

function App() {
  const message = "Hesllo World !";

  return (
    <>
      <Header />
      <h1 className="text-4xl font-bold underline text-red-600">{message}</h1>
    </>
  );
}

export default App;
