import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
