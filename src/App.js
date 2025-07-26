import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import VendorDashboard from "./pages/VendorDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vendor/login" element={<AuthPage mode="login" />} />
        <Route path="/vendor/register" element={<AuthPage mode="register" />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="*" element={<AuthPage mode="login" />} />
      </Routes>
    </BrowserRouter>
  );
}
