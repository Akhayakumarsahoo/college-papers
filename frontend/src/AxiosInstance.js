import axios from "axios";
import { toast } from "@/hooks/use-toast.js";

const AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_SERVER_URL + "/api"
      : "http://localhost:9000/api",
  withCredentials: true,
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const ignoreMessages = [
      "Refresh token is expired or used",
      "Invalid refresh token",
      "Refresh token not found",
    ];
    const errorMessage = error.response.data.message || "Something went wrong";
    if (error.response) {
      if (!ignoreMessages.includes(errorMessage)) {
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Network Error please try again",
        variant: "destructive",
      });
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
