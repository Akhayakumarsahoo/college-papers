import { useContext, useEffect, Suspense, lazy } from "react";
import LoadingPage from "./components/LoadingPage";
const Navbar = lazy(() => import("./components/Layouts/Navbar"));
const Footer = lazy(() => import("./components/Layouts/Footer"));
import { Outlet } from "react-router-dom";
import { GeneralContext } from "./GeneralContext";
import axios from "axios";

function App() {
  const { setUser } = useContext(GeneralContext);

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .post(`${import.meta.env.SERVER_URL}/users/refresh-token`)
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
