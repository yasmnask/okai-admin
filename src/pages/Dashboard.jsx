import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Handshake, Package, Truck, Bell, User, 
  History, CheckCircle2, AlertCircle, Edit, Plus, Loader2
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getDashboardSummary } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // State Dinamis
  const [data, setData] = useState({
    stats: { revenue: 0, komisi: 0, stock: 0, shipments: 0 },
    chart: [],
    logs: []
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("okai_admin")) || {};
    setAdminData(storedData);

    const fetchDashboard = async () => {
      try {
        const response = await getDashboardSummary();
        if (response.success) setData(response.data);
      } catch (error) {
        console.error("Gagal menarik data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Format ke Rupiah Singkat (Misal: 15.2M, 500K)
  const formatRupiahShort = (num) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(1)}K`;
    return `Rp ${num}`;
  };

  const formatRupiahChart = (num) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`;
    return `Rp ${num}`;
  };

  // Helper Icon & Warna untuk Logs
  const getLogStyle = (type) => {
    switch(type) {
      case 'success': 
        return { icon: <CheckCircle2 size={14} />, color: "text-[#E65100]", bg: "bg-orange-50 dark:bg-orange-900/20" };
      case 'new': 
        return { icon: <Plus size={14} />, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" };
      default: 
        return { icon: <AlertCircle size={14} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" };
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#121212]"><Loader2 className="animate-spin text-[#E65100]" size={48} /></div>;
  }

  const stats = [
    { label: "Total Penjualan", value: formatRupiahShort(data.stats.revenue), icon: <TrendingUp size={20} />, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Komisi Afiliasi", value: formatRupiahShort(data.stats.komisi), icon: <Handshake size={20} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Stok Produk", value: data.stats.stock.toLocaleString('id-ID'), icon: <Package size={20} />, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Pengiriman Aktif", value: data.stats.shipments, icon: <Truck size={20} />, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];

  return (
    <div className="p-8 h-screen bg-[#F8FAFC] dark:bg-[#121212] overflow-auto transition-colors font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight transition-colors">
            Performance <span className="text-[#E65100]">Overview</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic uppercase tracking-wider transition-colors">
            OKAI Admin Monitoring
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-white dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#2c2f2c] shadow-sm rounded-xl text-slate-400 dark:text-slate-300 hover:text-[#E65100] transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a1d1a]"></span>
          </button>
          <button onClick={() => navigate("/profile")} className="flex items-center gap-3 bg-white dark:bg-[#1a1d1a] p-1.5 pr-4 border border-slate-200 dark:border-[#2c2f2c] shadow-sm rounded-2xl hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 text-[#E65100] rounded-xl flex items-center justify-center group-hover:bg-[#E65100] group-hover:text-white transition-colors">
              <User size={20} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                {adminData?.role ? adminData.role.replace('_', ' ') : "Guest"}
              </p>
              <p className="text-sm font-bold text-slate-700 dark:text-white leading-none">
                {adminData?.name || "User"}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1a1d1a] p-6 rounded-3xl border border-slate-100 dark:border-[#2c2f2c] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>{stat.icon}</div>
              <div className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg flex items-center">
                <TrendingUp size={12} className="mr-1" /> Active
              </div>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 text-slate-800 dark:text-white">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART AREA */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#2c2f2c] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tight">Sales Analytics</h3>
            <button className="px-3 py-1 text-xs font-bold bg-orange-50 dark:bg-orange-900/30 text-[#E65100] rounded-lg">Monthly</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chart}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E65100" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} tickFormatter={formatRupiahChart} />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "#1E293B", color: "#fff" }} />
                <Area type="monotone" dataKey="sales" stroke="#E65100" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY LOGS */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#2c2f2c] shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <History size={20} className="text-[#E65100]" />
            <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tight">Recent Activity</h3>
          </div>
          <div className="space-y-6">
            {data.logs.map((log) => {
              const style = getLogStyle(log.type);
              return (
                <div key={log.id} className="flex gap-4 group cursor-default">
                  <div className={`w-10 h-10 ${style.bg} ${style.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">{log.action}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      <span className="text-[#E65100] font-bold">{log.user}</span> on {log.target}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate("/orders")} className="w-full mt-6 py-3 bg-slate-50 dark:bg-[#121212] text-slate-400 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-[#E65100] transition-all border border-transparent dark:border-[#2c2f2c]">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}