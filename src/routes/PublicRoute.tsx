import React from "react";
import { Navigate, Outlet } from "react-router";
import auth from "@lib/auth";

/**
 * PublicRoute
 * Prevents authenticated users from accessing public pages like /login or /register.
 * If a valid token exists, redirect to the home page.
 */
const PublicRoute: React.FC = () => {
  const valid = auth.isTokenValid();
  if (valid) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PublicRoute;
