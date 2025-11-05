import React from "react";
import { Navigate, Outlet } from "react-router";
import auth from "@lib/auth";

/**
 * ProtectedRoute
 * This component is used as a wrapper for routes that require authentication.
 * It uses `auth.isTokenValid()` (client-side expiry check) and redirects
 * to `/login` when there's no valid token.
 *
 * Important: server-side must still reject unauthorized requests. This
 * component only protects client-side navigation and user experience.
 */
const ProtectedRoute: React.FC = () => {
  const valid = auth.isTokenValid();
  if (!valid) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
