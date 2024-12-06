import { useEffect, Suspense, lazy } from "react";
import LoadingPage from "./components/LoadingPage";
const Navbar = lazy(() => import("./components/Layouts/Navbar"));
const Footer = lazy(() => import("./components/Layouts/Footer"));
import { Outlet } from "react-router-dom";
import AxiosInstance from "./api/AxiosInstance";
import useValues from "./hooks/useValues";

function App() {
  const { setUser } = useValues();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await AxiosInstance.post("/users/refresh-token");
        setUser(data.data.user);
        // console.log(data);
        AxiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.data.accessToken}`;
      } catch (error) {
        console.error(error);
      }
    })();
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
