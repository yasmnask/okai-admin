import React, { useState } from "react";
import toast from 'react-hot-toast';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logoutAdmin } from "../services/api";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Package,
  FileText,
  CreditCard,
  Truck,
  Ticket,
  BarChart3,
  Settings,
  Box,
  LogOut,
  UserCog,
  Menu,
  X,
  LayoutTemplate // 👈 Import Ikon Baru
} from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  //toggle darkmode
  const isDark = document.documentElement.classList.contains("dark");

  // Ambil data user untuk cek role
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));
  const userRole = adminData?.role?.toLowerCase();
  const userEmail = adminData?.email?.toLowerCase();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      roles: ["super_admin", "admin"],
    },
    {
      name: "User Management",
      icon: <Users size={20} />,
      path: "/users",
      roles: ["super_admin"],
    },
    {
      name: "Affiliate",
      icon: <Handshake size={20} />,
      path: "/affiliate",
      roles: ["super_admin", "affiliate"],
    },
    {
      name: "Products",
      icon: <Package size={20} />,
      path: "/product",
      roles: ["super_admin", "admin"],
    },
    {
      name: "Warehouses",
      icon: <Box size={20} />,
      path: "/warehouses",
      roles: ["super_admin", "admin"],
    },
    {
      name: "Orders",
      icon: <FileText size={20} />,
      path: "/orders",
      roles: ["super_admin", "admin"],
    },
    {
      name: "Logistics",
      icon: <Truck size={20} />,
      path: "/logistics",
      roles: ["super_admin", "admin"],
    },
    {
      name: "Promotions",
      icon: <Ticket size={20} />,
      path: "/promotions",
      roles: ["super_admin"],
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/analytics",
      roles: ["super_admin"],
    },
    {
      name: "Profile Settings",
      icon: <UserCog size={20} />,
      path: "/profile",
      roles: ["super_admin", "admin", "affiliate"],
    },
    {
      name: "System Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      roles: ["super_admin"],
    },
    // 👇 TAMBAHAN MENU BARU 👇
    {
      name: "Homepage Settings",
      icon: <LayoutTemplate size={20} />,
      path: "/homepage-settings",
      roles: ["super_admin"],
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      localStorage.removeItem("okai_admin");
      navigate("/login");
    } catch (error) {
      console.error("Terjadi kendala saat logout:", error);
      localStorage.removeItem("okai_admin");
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#121212] text-[#1E293B]">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-72 bg-white dark:bg-[#1a1d1a] border-r border-slate-200 dark:border-0 dark:shadow-black dark:shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex flex-col`}
      >
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E65100] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100 dark:shadow-black">
              <Box size={24} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#E65100]">
                OKAI
              </span>
              <span className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Admin Portal
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 dark:text-slate-300">
              <X size={22} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems
            .filter((item) => {
              if (!item.roles.includes(userRole)) return false;
              if (item.name === "System Settings" && userEmail !== 'admin@gmail.com') return false;
              return true;
            })
            .map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? "bg-[#E65100] text-white shadow-md shadow-orange-100 dark:shadow-black"
                    : "bg-white dark:bg-[#1a1d1a] text-slate-500 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-[#2c2f2c] hover:text-[#E65100] dark:hover:text-[#E65100]"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-semibold">{item.name}</span>
              </button>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-[#2c2f2c]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-500 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-500 rounded-xl transition-all font-semibold text-sm"
          >
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8FAFC] dark:bg-[#121212]">
        <div className="lg:hidden p-4">
          <button onClick={() => setIsOpen(true)} className="text-slate-500 dark:text-slate-300">
            <Menu size={24} />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}