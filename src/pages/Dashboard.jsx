import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Handshake, Package, Truck, Bell, User, 
  History, CheckCircle2, AlertCircle, Edit, Plus
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'Mei', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

// Mock Data untuk Activity Logs
const activityLogs = [
  { id: 1, user: "Muhammad Fawwas", action: "Updated Stock", target: "Sepatu Lari Pro-X", time: "2 mins ago", icon: <Edit size={14} />, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 2, user: "System", action: "New Order Received", target: "ORD-99281", time: "15 mins ago", icon: <Plus size={14} />, color: "text-green-600", bg: "bg-green-50" },
  { id: 3, user: "Admin OKAI", action: "Payment Confirmed", target: "TRX-8812", time: "1 hour ago", icon: <CheckCircle2 size={14} />, color: "text-[#E65100]", bg: "bg-orange-50" },
  { id: 4, user: "System", action: "Low Stock Alert", target: "Tas Ransel Outdoor", time: "3 hours ago", icon: <AlertCircle size={14} />, color: "text-red-600", bg: "bg-red-50" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = { name: "Muhammad Fawwas" };

  const stats = [
    { label: 'Total Penjualan', value: 'Rp 15.2M', icon: <TrendingUp size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Komisi Afiliasi', value: 'Rp 2.4M', icon: <Handshake size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Stok Produk', value: '1,240', icon: <Package size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pengiriman Aktif', value: '86', icon: <Truck size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Performance <span className="text-[#E65100]">Overview</span></h1>
          <p className="text-slate-400 text-sm font-medium italic uppercase tracking-wider">OKAI Admin Monitoring</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#E65100] transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 bg-white p-1.5 pr-4 border border-slate-100 rounded-2xl hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-orange-50 text-[#E65100] rounded-xl flex items-center justify-center group-hover:bg-[#E65100] group-hover:text-white transition-colors">
              <User size={20} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Administrator</p>
              <p className="text-sm font-bold text-slate-700 leading-none">{user.name}</p>
            </div>
          </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>{stat.icon}</div>
              <div className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg flex items-center">
                <TrendingUp size={12} className="mr-1" /> +12%
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 text-slate-800">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART AREA */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-lg text-slate-800 tracking-tight">Sales Analytics</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold bg-orange-50 text-[#E65100] rounded-lg">Monthly</button>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E65100" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#E65100" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="sales" stroke="#E65100" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* RECENT ACTIVITY LOGS SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <History size={20} className="text-[#E65100]" />
            <h3 className="font-black text-lg text-slate-800 tracking-tight">Recent Activity</h3>
          </div>
          <div className="space-y-6">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex gap-4 group cursor-default">
                <div className={`w-10 h-10 ${log.bg} ${log.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  {log.icon}
                </div>
                <div className="flex-1 border-b border-slate-50 pb-4">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-slate-800">{log.action}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    <span className="text-[#E65100] font-bold">{log.user}</span> on {log.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-orange-50 hover:text-[#E65100] transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
}