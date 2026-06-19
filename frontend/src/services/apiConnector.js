import axios from "axios";
import { toast } from "react-hot-toast";
import { DEPLOYED_BASE_URL, LOCAL_BASE_URL } from "./apis";

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
  const requestConfig = {
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  };

  return axiosInstance(requestConfig).catch((error) => {
    const isLocalFrontend =
      typeof window !== "undefined" &&
      ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const shouldRetryMissingLocalUser =
      error?.response?.status === 400 &&
      error?.response?.data?.message === "User not found" &&
      url?.startsWith(`${LOCAL_BASE_URL}/auth/login`);

    const canRetryDeployed =
      url?.startsWith(LOCAL_BASE_URL) &&
      isLocalFrontend &&
      (!error.response || shouldRetryMissingLocalUser);

    if (!canRetryDeployed) {
      return Promise.reject(error);
    }

    return axiosInstance({
      ...requestConfig,
      url: url.replace(LOCAL_BASE_URL, DEPLOYED_BASE_URL),
    });
  });
};
