import axios from "axios";
import { toast } from "@/hooks/use-toast.js";

const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  withCredentials: true,
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast({
        title: error.response.data.message || "Something went wrong",
        variant: "destructive",
      });
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
