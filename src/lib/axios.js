import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const setCookie = (name, value, seconds) => {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + seconds * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name) => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, val] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(val);
    }
  }
  return null;
};

const deleteCookie = (name) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const getToken = () => {
  return getCookie("autobizz_token");
};

const getTokenExpiry = () => {
  const expiry = getCookie("autobizz_token_expiry");
  return expiry ? parseInt(expiry, 10) : null;
};

const setAuthToken = (token, expireSeconds) => {
  setCookie("autobizz_token", token, expireSeconds);
  setCookie("autobizz_token_expiry", String(Date.now() + expireSeconds * 1000), expireSeconds);
};

const clearAuthToken = () => {
  deleteCookie("autobizz_token");
  deleteCookie("autobizz_token_expiry");
};

const isTokenValid = () => {
  const token = getToken();
  const expiry = getTokenExpiry();
  return !!(token && expiry && Date.now() < expiry);
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined" && !config.url?.includes("getAuthorize")) {
      const token = getToken();
      if (token && isTokenValid()) {
        config.headers["X-AUTOBIZZ-TOKEN"] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(`[Response Error]`, error.response?.status, error.message);
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        clearAuthToken();
      }
    }
    return Promise.reject(error);
  }
);

export { getToken, setAuthToken, clearAuthToken, isTokenValid };
export default axiosInstance;
