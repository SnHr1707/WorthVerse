/** @format */

import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";

function App() {
  return (
    <>
        <Navbar />
        <div className="flex-grow-1">
        <Outlet />
        </div>
    </>
  );
}

export default App;