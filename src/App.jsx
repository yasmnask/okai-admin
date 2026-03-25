import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmailPage from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import ProductManagement from "./pages/ProductManagement";
import SystemSettings from "./pages/SystemSettings";
import MainLayout from "./components/MainLayout";
import Logistics from "./pages/Logistics";
import Affiliate from "./pages/Affiliate";
import Payments from "./pages/Payments";
import UserManagement from "./pages/UserManagement"; 
import Promotions from "./pages/Promotions";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute tanpa Sidebar */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:id/:hash" element={<VerifyEmailPage />} />
        

        {/* Rute dengan Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductManagement />} />
          <Route path="/users" element={<UserManagement />} /> {/* Pastikan ini sudah benar */}
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/logistics" element={<Logistics/>} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}