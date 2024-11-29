import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GeneralContext } from "./GeneralContext";
import axios from "axios";

function App() {
  const { setUser } = useContext(GeneralContext);

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .post("/api/users/refresh-token")
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
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
