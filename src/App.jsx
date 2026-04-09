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
import EditUser from "./pages/EditUser";
import Promotions from "./pages/Promotions";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AddUser from "./pages/AddUser";
import AddPromotion from "./pages/AddPromotions";
import EditPromotion from "./pages/EditPromotions";

// --- KOMPONEN PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));
  const userRole = adminData?.role?.toLowerCase();

  // 1. Cek apakah user sudah login? Kalau belum, tendang ke halaman login
  if (!adminData) return <Navigate to="/login" replace />;
  
  // 2. Cek apakah role diizinkan masuk ke rute ini?
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // FIX: Kalau yang nyasar Affiliate, kembalikan ke /affiliate. Kalau admin nyasar, ke /dashboard
    return userRole === 'affiliate' ? <Navigate to="/affiliate" replace /> : <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:id/:hash" element={<VerifyEmailPage />} />

        {/* Rute Admin/Superadmin (Tanpa Sidebar/Layout) */}
        <Route path="/product/create" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AddProduct /></ProtectedRoute>} />
        <Route path="/product/edit/:id" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><EditProduct /></ProtectedRoute>} />
        <Route path="/users/create" element={<ProtectedRoute allowedRoles={['super_admin']}><AddUser /></ProtectedRoute>} />
        <Route path="/users/edit/:id" element={<ProtectedRoute allowedRoles={['super_admin']}><EditUser /></ProtectedRoute>} />

        {/* Rute dengan Sidebar (MainLayout) */}
        <Route element={<MainLayout />}>
          
          {/* FIX: Profile & Affiliate dibungkus ProtectedRoute biar gak bisa diakses orang tanpa login */}
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'affiliate']}><ProfileSettings /></ProtectedRoute>} />
          <Route path="/affiliate" element={<ProtectedRoute allowedRoles={['super_admin', 'admin', 'affiliate']}><Affiliate /></ProtectedRoute>} />

          {/* Hanya Superadmin */}
          <Route path="/users" element={<ProtectedRoute allowedRoles={['super_admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['super_admin']}><SystemSettings /></ProtectedRoute>} />
          
          {/* Superadmin & Admin Operasional */}
          <Route path="/product" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><ProductManagement /></ProtectedRoute>} />
          <Route path="/logistics" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Logistics/></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Payments /></ProtectedRoute>} />
          <Route path="/promotions" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Promotions /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Orders /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><Dashboard /></ProtectedRoute>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}