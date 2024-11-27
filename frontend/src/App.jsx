import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GeneralContext } from "./GeneralContext";
import axios from "axios";
// import { toast } from "./hooks/use-toast";

function App() {
  const { setUser } = useContext(GeneralContext);

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const { data } = await axios.post("/api/users/refresh-token", {
          withCredentials: true,
        });
        // console.log(data);

        if (data.success) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      };
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
