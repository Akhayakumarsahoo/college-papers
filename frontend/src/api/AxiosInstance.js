import axios from "axios";
import { toast } from "@/hooks/use-toast.js";

const AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:9000/api"
      : `https://college-papers-production.up.railway.app/api`,
  withCredentials: true,
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users")
    ) {
      originalRequest._retry = true;
      return AxiosInstance.post("/users/refresh-token").then((response) => {
        AxiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.accessToken}`;
        return AxiosInstance(originalRequest);
      });
    }

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
