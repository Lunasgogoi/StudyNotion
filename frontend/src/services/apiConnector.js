import axios from "axios";
import { toast } from "react-hot-toast";

// Create a customized instance of Axios
export const axiosInstance = axios.create({});

let sessionExpiredToastShown = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      error.isAuthExpired = true;

      if (!sessionExpiredToastShown) {
        sessionExpiredToastShown = true;
        toast.error(error?.response?.data?.message || "Session expired. Please log in again.");
      }

      if (window.location.pathname !== "/login") {
        setTimeout(() => {
          window.location.href = "/login";
        }, 600);
      }
    }

    return Promise.reject(error);
  }
);

// Export a generic function to handle all API requests
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
