import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cookie helper functions
const setCookie = (name, value, seconds) => {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + seconds * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  console.log(`[Cookie] Set ${name}, expires in ${seconds} seconds`);
};

const getCookie = (name) => {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, val] = cookie.split("=");
    if (key === name) {
      const value = decodeURIComponent(val);
      console.log(`[Cookie] Get ${name}:`, value);
      return value;
    }
  }
  console.log(`[Cookie] ${name} not found`);
  return null;
};

const deleteCookie = (name) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  console.log(`[Cookie] Deleted ${name}`);
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
  const valid = !!(token && expiry && Date.now() < expiry);
  console.log(`[Auth] Token valid:`, valid);
  return valid;
};

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    if (typeof window !== "undefined" && !config.url?.includes("getAuthorize")) {
      const token = getToken();
      if (token && isTokenValid()) {
        config.headers["X-AUTOBIZZ-TOKEN"] = token;
        console.log(`[Request] Added X-AUTOBIZZ-TOKEN header:`, token);
      }
    }
    
    if (config.params) {
      console.log(`[Request] Query params:`, config.params);
    }
    if (config.data) {
      console.log(`[Request] Body:`, config.data);
    }
    
    return config;
  },
  (error) => {
    console.error(`[Request Error]`, error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Response] ${response.status} ${response.config.url}`);
    console.log(`[Response] Data:`, response.data);
    return response;
  },
  (error) => {
    console.error(`[Response Error]`, error.response?.status, error.message);
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.log(`[Auth] 401 - Clearing token`);
        clearAuthToken();
      }
    }
    return Promise.reject(error);
  }
);

export { getToken, setAuthToken, clearAuthToken, isTokenValid };
export default axiosInstance;
