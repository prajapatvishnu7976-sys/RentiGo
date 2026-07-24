import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("rentigo_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error - no response
    if (!error.response) {
      toast.error("Network error. Check if backend is running.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        if (data?.message !== "Invalid email or password") {
          localStorage.removeItem("rentigo_token");
          localStorage.removeItem("rentigo_user");
          if (window.location.pathname !== "/login") {
            toast.error("Session expired. Please login again.");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
        }
        break;

      case 403:
        toast.error(data?.message || "Access denied");
        break;

      case 404:
        // Let component handle 404
        break;

      case 429:
        toast.error("Too many requests. Please wait a moment.");
        break;

      case 500:
        // Show actual server error message if available
        toast.error(data?.message || "Server error. Please try again.");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default api;