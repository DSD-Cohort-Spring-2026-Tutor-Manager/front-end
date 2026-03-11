import axios from "axios";

const axiosInstance = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach Bearer token from Zustand store
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// Response interceptor — handle 403 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Show a simple alert (can be replaced with a toast library)
      if (typeof window !== "undefined") {
        console.warn("Access denied");
        window.location.href = "/unauthorized";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
