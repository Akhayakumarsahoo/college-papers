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
      await AxiosInstance.post("/users/refresh-token")
        .then(({ data }) => {
          setUser(data.data.user);
          // console.log(data);
          AxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.data.accessToken}`;
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
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
