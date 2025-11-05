import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "@pages/HomePage";
import NotFound from "@pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProtectedRoute from "@routes/ProtectedRoute";
import PublicRoute from "@routes/PublicRoute";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Public routes - when user is already authenticated (valid JWT)
            we don't want them to access login/register. Wrap them with PublicRoute
            which will redirect to `/` if a valid token exists. */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;