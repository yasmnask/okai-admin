import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Handshake,
  Package,
  Truck,
  Bell,
  User,
  History,
  CheckCircle2,
  AlertCircle,
  Edit,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Apr", sales: 2780 },
  { name: "Mei", sales: 1890 },
  { name: "Jun", sales: 2390 },
];

// Mock Data untuk Activity Logs
const activityLogs = [
  {
    id: 1,
    user: "System",
    action: "Updated Stock",
    target: "Sepatu Lari Pro-X",
    time: "2 mins ago",
    icon: <Edit size={14} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    user: "System",
    action: "New Order Received",
    target: "ORD-99281",
    time: "15 mins ago",
    icon: <Plus size={14} />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    user: "Admin OKAI",
    action: "Payment Confirmed",
    target: "TRX-8812",
    time: "1 hour ago",
    icon: <CheckCircle2 size={14} />,
    color: "text-[#E65100]",
    bg: "bg-orange-50",
  },
  {
    id: 4,
    user: "System",
    action: "Low Stock Alert",
    target: "Tas Ransel Outdoor",
    time: "3 hours ago",
    icon: <AlertCircle size={14} />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State untuk menyimpan data user yang sedang login
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    // Tarik data dari localStorage saat halaman diload
    const storedData = JSON.parse(localStorage.getItem("okai_admin")) || {};
    setAdminData(storedData);
  }, []);

  const stats = [
    {
      label: "Total Penjualan",
      value: "Rp 15.2M",
      icon: <TrendingUp size={20} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Komisi Afiliasi",
      value: "Rp 2.4M",
      icon: <Handshake size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Stok Produk",
      value: "1,240",
      icon: <Package size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pengiriman Aktif",
      value: "86",
      icon: <Truck size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-8 h-screen bg-white dark:bg-[#1a1e1a] overflow-auto transition-colors">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black dark:text-white tracking-tight transition-colors">
            Performance <span className="text-[#E65100]">Overview</span>
          </h1>
          <p className="text-slate-400 dark:text-[#e1d4cc] text-sm font-medium italic uppercase tracking-wider transition-colors">
            OKAI Admin Monitoring
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-white dark:bg-[#3e3c3a] border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-sm rounded-xl text-slate-400 dark:text-slate-200 hover:text-[#E65100] transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#3e3c3a] transition-colors"></span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 bg-white dark:bg-[#3e3c3a] p-1.5 pr-4 border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-sm rounded-2xl hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-orange-50 dark:bg-[#E65100] text-[#E65100] dark:text-white rounded-xl flex items-center justify-center group-hover:bg-[#E65100] dark:group-hover:bg-orange-50 group-hover:text-white dark:group-hover:text-[#E65100] transition-colors">
              <User size={20} />
            </div>
            <div className="text-left hidden sm:block">
              {/* NAMA ROLE DAN NAMA USER DINAMIS DARI LOCALSTORAGE */}
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-200 uppercase tracking-widest leading-none mb-1 transition-colors">
                {adminData?.role ? adminData.role.replace('_', ' ') : "Guest"}
              </p>
              <p className="text-sm font-bold text-slate-700 dark:text-[#e1d4cc] leading-none transition-colors">
                {adminData?.name || "User"}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a1d1a] p-6 rounded-3xl border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                {stat.icon}
              </div>
              <div className="text-green-500 dark:text-green-50 text-xs font-bold bg-green-50 dark:bg-green-500 px-2 py-1 rounded-lg flex items-center transition-colors">
                <TrendingUp size={12} className="mr-1" /> +12%
              </div>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider transition-colors">
              {stat.label}
            </p>
            <h2 className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-200 transition-colors">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART AREA */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-2xl shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 tracking-tight transition-colors">
              Sales Analytics
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold bg-orange-50 dark:bg-[#E65100] text-[#E65100] dark:text-orange-50 rounded-lg transition-colors">
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E65100" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    backgroundColor: "var(--tw-colors-white)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#E65100"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY LOGS SECTION */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-2xl shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-8">
            <History size={20} className="text-[#E65100]" />
            <h3 className="font-black text-lg text-slate-800 dark:text-slate-200 tracking-tight transition-colors">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-6">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex gap-4 group cursor-default">
                <div
                  className={`w-10 h-10 ${log.bg} ${log.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  {log.icon}
                </div>
                <div className="flex-1 border-b border-slate-50 dark:border-slate-800/50 pb-4 transition-colors">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">
                      {log.action}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">
                      {log.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium transition-colors">
                    <span className="text-[#E65100] font-bold">{log.user}</span>{" "}
                    on {log.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-50 dark:bg-[#2a2d2a] text-slate-400 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-orange-50 dark:hover:bg-[#E65100] hover:text-[#E65100] dark:hover:text-white transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}