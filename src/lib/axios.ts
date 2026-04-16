import axios from "axios";
import auth from "@lib/auth";
import { toast } from "sonner";

export const domain: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";


const NO_RETRY_HEADER = "x-no-retry";
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Create a central axios instance for the app. We attach interceptors so that
// Authorization and token-expiry behavior is centralized in one place.
const api = axios.create({
  baseURL: domain as string,
  withCredentials: true, // Include cookies in all requests
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 Refresh token handler responsibilities:
  - Call /auth/refresh-token endpoint to get a new access token
  - Update the stored token with the new one
  - Return the new token or null if refresh fails
*/
const handleRefreshToken = async (): Promise<string | null> => {
  // If already refreshing, wait for that promise instead of making another request
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await axios.post(`${domain}/auth/refresh-token`, {}, {
        withCredentials: true, // Include cookies in the request
      });
      if (response?.data?.accessToken) {
        const newToken = response.data.accessToken;
        auth.setToken(newToken);
        return newToken;
      }
      return null;
    } catch (error: any) {
      console.error("Failed to refresh token:", error.message);
      auth.removeToken();
      toast.error("Session expired, please log in again.");
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }, 2000);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/*
 Request interceptor responsibilities:
  - read stored token (if any)
  - attach Authorization header if token exists
  - exclude refresh-token endpoint from interceptor to avoid infinite loops
  - let backend validate token expiry and respond with 401 if needed
*/
api.interceptors.request.use(
  async (config) => {
    // Skip interceptor for refresh token endpoint
    if (config.url?.includes("/auth/refresh-token")) {
      return config;
    }

    const token = auth.getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/*
 Response interceptor responsibilities:
  - If the server returns 401 (unauthorized), attempt to refresh the token
  - If refresh is successful, retry the original request with the new token
  - If refresh fails or request was already retried, redirect to /login
*/
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    
    if (
      originalConfig &&
      err?.response?.status === 401 &&
      originalConfig.url !== "/auth/login" &&
      originalConfig.url !== "/auth/refresh-token" &&
      !originalConfig.headers[NO_RETRY_HEADER]
    ) {
      // Mark this request as already retried to prevent infinite loops
      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers[NO_RETRY_HEADER] = "true";

      // Attempt to refresh the token
      const newToken = await handleRefreshToken();

      if (newToken) {
        // Update the authorization header with the new token
        originalConfig.headers["Authorization"] = `Bearer ${newToken}`;
        // Retry the original request
        return api.request(originalConfig);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
