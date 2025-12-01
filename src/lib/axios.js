import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthData = () => {
  if (typeof window === "undefined") return null;
  const authData = localStorage.getItem("authData");
  if (!authData) return null;
  try {
    return JSON.parse(authData);
  } catch {
    return null;
  }
};

const isTokenValid = () => {
  const authData = getAuthData();
  if (!authData?.token || !authData?.expiresAt) return false;
  return Date.now() < authData.expiresAt;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined" && !config.url?.includes("getAuthorize")) {
      const authData = getAuthData();
      if (authData?.token && isTokenValid()) {
        config.headers["X-AUTOBIZZ-TOKEN"] = authData.token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authData");
        }
      }
    }
    return Promise.reject(error);
  }
);

export { getAuthData, isTokenValid };
export default axiosInstance;
