import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import VerifyEmailPage from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import ProductManagement from "./pages/ProductManagement";
import WarehouseManagement from "./pages/WarehouseManagement";
import WarehouseDetail from "./pages/WarehouseDetail";
import SystemSettings from "./pages/SystemSettings";
import MainLayout from "./components/MainLayout";
import Logistics from "./pages/Logistics";
import Affiliate from "./pages/Affiliate";
import Payments from "./pages/Payments";
import UserManagement from "./pages/UserManagement"; 
import EditUser from "./pages/EditUser";
import Promotions from "./pages/Promotions";
import Orders from "./pages/Orders";
import ShowOrders from "./pages/ShowOrders";
import Analytics from "./pages/Analytics";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AddUser from "./pages/AddUser";
import DetailAffiliator from "./pages/DetailAffiliator";
import AddPromotion from "./pages/AddPromotions";
import EditPromotion from "./pages/EditPromotions";
import HomepageSettings from "./pages/HomepageSettings"; // 👈 IMPORT HALAMAN BARU
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// --- KOMPONEN PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles, allowedEmails }) => {
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));
  const userRole = adminData?.role?.toLowerCase();
  const userEmail = adminData?.email?.toLowerCase();

  // 1. Cek apakah user sudah login? Kalau belum, tendang ke login
  if (!adminData) return <Navigate to="/login" replace />;
  
  // 2. Cek apakah role diizinkan masuk ke rute ini?
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return userRole === 'affiliate' ? <Navigate to="/affiliate" replace /> : <Navigate to="/dashboard" replace />;
  }

  // 3. Cek apakah email diizinkan masuk ke rute ini?
  if (allowedEmails && !allowedEmails.includes(userEmail)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {

  // 👇 OBAT BUG DARK MODE 👇
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  // 👆 ---------------------------- 👆

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:id/:hash" element={<VerifyEmailPage />} />

        {/* Rute Admin/Superadmin (Tanpa Sidebar/Layout) */}
        <Route path="/product/create" element={<ProtectedRoute allowedRoles={['super_admin']}><AddProduct /></ProtectedRoute>} />
        <Route path="/product/edit/:id" element={<ProtectedRoute allowedRoles={['super_admin']}><EditProduct /></ProtectedRoute>} />
        <Route path="/users/create" element={<ProtectedRoute allowedRoles={['super_admin']}><AddUser /></ProtectedRoute>} />
        <Route path="/users/edit/:id" element={<ProtectedRoute allowedRoles={['super_admin']}><EditUser /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><ShowOrders /></ProtectedRoute>} />
        
        {/* Rute Promosi */}
        <Route path="/promotions/addpromotion" element={<ProtectedRoute allowedRoles={['super_admin']}><AddPromotion /></ProtectedRoute>} />
        <Route path="/promotions/edit/:id" element={<ProtectedRoute allowedRoles={['super_admin']}><EditPromotion /></ProtectedRoute>} />

        {/* Rute dengan Sidebar (MainLayout) */}
        <Route element={<MainLayout />}>
          
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'affiliate']}><ProfileSettings /></ProtectedRoute>} />
          <Route path="/affiliate" element={<ProtectedRoute allowedRoles={['super_admin', 'affiliate']}><Affiliate /></ProtectedRoute>} />
          <Route path="/affiliate/:id" element={<ProtectedRoute allowedRoles={['super_admin', 'affiliate']}><DetailAffiliator /></ProtectedRoute>} />

          {/* Hanya Superadmin */}
          <Route path="/users" element={<ProtectedRoute allowedRoles={['super_admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['super_admin']} allowedEmails={['admin@gmail.com']}><SystemSettings /></ProtectedRoute>} />
          
          {/* 👇 RUTE BARU: HOMEPAGE SETTINGS 👇 */}
          <Route path="/homepage-settings" element={<ProtectedRoute allowedRoles={['super_admin']}><HomepageSettings /></ProtectedRoute>} />

          {/* Superadmin & Admin Operasional */}
          <Route path="/product" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><ProductManagement /></ProtectedRoute>} />
          <Route path="/warehouses" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><WarehouseManagement /></ProtectedRoute>} />
          <Route path="/warehouse/:id" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><WarehouseDetail /></ProtectedRoute>} />
          <Route path="/logistics" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Logistics/></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute allowedRoles={['super_admin']}><Payments /></ProtectedRoute>} />
          <Route path="/promotions" element={<ProtectedRoute allowedRoles={['super_admin']}><Promotions /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Orders /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute allowedRoles={['super_admin']}><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Dashboard /></ProtectedRoute>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}