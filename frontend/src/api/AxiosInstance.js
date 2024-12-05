import axios from "axios";
import { toast } from "@/hooks/use-toast.js";

const AxiosInstance = axios.create({
  baseURL: `https://college-papers-production.up.railway./api`,
  withCredentials: true,
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;
      return AxiosInstance.post("/users/refresh-token").then((response) => {
        AxiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.accessToken}`; // update the token
        return AxiosInstance(originalRequest); // retry the original request
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
