import { useContext, useEffect, Suspense, lazy } from "react";
import LoadingPage from "./components/LoadingPage";
const Navbar = lazy(() => import("./components/Layouts/Navbar"));
const Footer = lazy(() => import("./components/Layouts/Footer"));
import { Outlet } from "react-router-dom";
import { GeneralContext } from "./GeneralContext";
import axios from "axios";

function App() {
  const { setUser } = useContext(GeneralContext);
  console.log("VITE_SERVER_URL", import.meta.env.VITE_SERVER_URL);

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .post(`${import.meta.env.VITE_SERVER_URL}/api/users/refresh-token`)
        .then(({ data }) => {
          setUser(data.data);
        })
        .catch(() => {
          setUser(null);
          // console.error("Error fetching user:", err);
        });
    };

    fetchUser();
  }, [setUser]);

  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Navbar />
        <Outlet />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
