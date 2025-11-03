import { BrowserRouter, Routes, Route } from "react-router"
import HomePage from "@pages/HomePage"
import NotFound from "@pages/NotFound"
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

const RoutesApp = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
  );
};

export default RoutesApp;