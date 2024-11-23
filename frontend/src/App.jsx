import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
