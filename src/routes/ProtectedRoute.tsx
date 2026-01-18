import React from "react";
import { Navigate, Outlet } from "react-router";
import auth from "@lib/auth";

/**
 * ProtectedRoute
 * This component is used as a wrapper for routes that require authentication.
 * It checks if a token exists in localStorage.
 *
 * Important notes:
 * - Token expiry validation is handled by the backend (via 401 responses)
 * - This component only checks token existence for client-side navigation protection
 * - If token is expired, the backend will return 401, and axios interceptors will handle refresh/redirect
 */
const ProtectedRoute: React.FC = () => {
  const token = auth.getToken();
  
  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
