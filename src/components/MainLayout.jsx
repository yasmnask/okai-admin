import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logoutAdmin } from '../services/api';
import { 
  LayoutDashboard, Users, Handshake, Package, FileText, 
  CreditCard, Truck, Ticket, BarChart3, Settings, Box, LogOut, UserCog 
} from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil data user untuk cek role
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));
  const userRole = adminData?.role?.toLowerCase();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['super_admin', 'admin'] },
    { name: 'User Management', icon: <Users size={20} />, path: '/users', roles: ['super_admin'] },
    { name: 'Affiliate', icon: <Handshake size={20} />, path: '/affiliate', roles: ['super_admin', 'admin', 'affiliate'] },
    { name: 'Products', icon: <Package size={20} />, path: '/product', roles: ['super_admin', 'admin'] },
    { name: 'Orders', icon: <FileText size={20} />, path: '/orders', roles: ['super_admin', 'admin'] },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/payments', roles: ['super_admin', 'admin'] },
    { name: 'Logistics', icon: <Truck size={20} />, path: '/logistics', roles: ['super_admin', 'admin'] },
    { name: 'Promotions', icon: <Ticket size={20} />, path: '/promotions', roles: ['super_admin', 'admin'] },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics', roles: ['super_admin', 'admin'] },
    { name: 'Profile Settings', icon: <UserCog size={20} />, path: '/profile', roles: ['super_admin', 'admin', 'affiliate'] },
    { name: 'System Settings', icon: <Settings size={20} />, path: '/settings', roles: ['super_admin'] },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();       
      localStorage.removeItem("okai_admin"); 
      navigate('/login'); 
    } catch (error) {
      console.error("Terjadi kendala saat logout:", error);
      localStorage.removeItem("okai_admin");
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E65100] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Box size={24} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#E65100]">OKAI</span>
              <span className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase">Admin Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems
            // --- LOGIKA FILTER BERDASARKAN ROLE ---
            .filter(item => item.roles.includes(userRole)) 
            .map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path 
                  ? 'bg-[#E65100] text-white shadow-md shadow-orange-100' 
                  : 'text-slate-500 hover:bg-orange-50 hover:text-[#E65100]'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm font-semibold">{item.name}</span>
              </button>
            ))
          }
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-semibold text-sm">
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}