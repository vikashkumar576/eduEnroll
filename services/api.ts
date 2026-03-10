import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ──────────────────────────────────────────────
// Request Interceptor
// ──────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if available (e.g. stored in localStorage/cookie)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────
// Response Interceptor
// ──────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: "An unexpected error occurred. Please try again.",
      statusCode: error.response?.status,
    };

    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      if (typeof data.message === "string") {
        apiError.message = data.message;
      }
      if (data.errors && typeof data.errors === "object") {
        apiError.errors = data.errors as Record<string, string[]>;
      }
    } else if (error.code === "ECONNABORTED") {
      apiError.message = "Request timed out. Please check your connection.";
    } else if (!error.response) {
      apiError.message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(apiError);
  }
);

export default api;
