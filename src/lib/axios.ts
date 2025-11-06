import axios from "axios";
import auth from "@lib/auth";

export const domain: string = "http://localhost:5001";


// Create a central axios instance for the app. We attach interceptors so that
// Authorization and token-expiry behavior is centralized in one place.
const api = axios.create({
  baseURL: domain as string,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 Request interceptor responsibilities:
  - read stored token (if any)
  - check token expiry client-side (quick UX check) and redirect to /login if expired
  - attach Authorization header if token exists and is valid

  Note: the interceptor's expiry check is only a UX convenience; the server
  must still validate the token signature and expiry on every request.
*/
api.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      // if token expired, remove and redirect to login
      if (!auth.isTokenValid(token)) {
        // remove token from storage and redirect to login to force re-auth
        auth.removeToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        // reject the request so the caller sees an error instead of sending a bad request
        return Promise.reject(new Error("Token expired"));
      }
      // attach header for authenticated requests
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/*
 Response interceptor responsibilities:
  - If the server returns 401 (unauthorized) we'll clear the stored token and
    redirect to /login. This handles cases where server-side validation failed.
*/
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      auth.removeToken();
      setTimeout(() => {
        if (typeof window !== "undefined") window.location.href = "/login";
      }, 2000);
    }
    return Promise.reject(err);
  }
);

export default api;
