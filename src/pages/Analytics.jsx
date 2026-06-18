import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import {
  TrendingUp, Users, ShoppingBag, DollarSign, Download, Calendar,
  ArrowUpRight, Handshake, MousePointer2, Loader2
} from "lucide-react";
import { getAnalyticsDashboard } from "../services/api";

const COLORS = ["#E65100", "#FB8C00", "#FFB74D", "#FFE0B2"];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { total_items_sold: 0, avg_order_value: 0, affiliate_sales: 0, new_customers: 0 },
    revenue_chart: [],
    category_chart: [],
    top_products: []
  });

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalyticsDashboard();
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Gagal menarik data analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#121212]">
        <Loader2 className="animate-spin text-[#E65100]" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#121212] min-h-screen font-sans selection:bg-[#E65100] selection:text-white transition-colors duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] dark:text-white">
            Business <span className="text-[#E65100]">Analytics</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">
            Data-driven insights for PT Otak Kanan growth
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-[#1a1d1a] border border-slate-200 dark:border-[#2c2f2c] text-slate-600 dark:text-slate-300 px-5 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-[#2c2f2c] transition-all">
            <Calendar size={18} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-[#E65100] text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 dark:shadow-black hover:bg-orange-700 transition-colors">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Produk Terjual",
            value: data.stats.total_items_sold,
            trend: "All Time",
            up: true,
            icon: <ShoppingBag size={20} />,
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Avg. Order Value",
            value: formatIDR(data.stats.avg_order_value),
            trend: "Per Invoice",
            up: true,
            icon: <DollarSign size={20} />,
            bg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "Penjualan Mitra",
            value: data.stats.affiliate_sales + " Pesanan",
            trend: "Affiliate & Dropship",
            up: true,
            icon: <Handshake size={20} />,
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Total Customers",
            value: data.stats.new_customers,
            trend: "Registered",
            up: true,
            icon: <Users size={20} />,
            bg: "bg-orange-50 dark:bg-orange-900/20",
            text: "text-orange-600 dark:text-orange-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1a1d1a] p-6 rounded-3xl border border-slate-100 dark:border-[#2c2f2c] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bg} ${stat.text} rounded-2xl`}>
                {stat.icon}
              </div>
              <span
                className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.up ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {stat.label}
            </p>
            <h2 className="text-2xl font-black mt-1 text-slate-800 dark:text-white tracking-tight">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* REVENUE GROWTH AREA CHART */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#2c2f2c] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 dark:text-white text-lg">
              Revenue Growth
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                <div className="w-2 h-2 rounded-full bg-[#E65100]"></div> Income
              </span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue_chart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E65100" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} tickFormatter={(value) => `Rp${value / 1000000}M`} />
                <Tooltip 
                  formatter={(value) => formatIDR(value)}
                  contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "#1E293B", color: "#fff", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)" }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#E65100" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SALES BY CATEGORY DONUT CHART */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#2c2f2c] shadow-sm">
          <h3 className="font-black text-slate-800 dark:text-white text-lg mb-8">
            Sales by Category
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.category_chart} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {data.category_chart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", backgroundColor: "#1E293B", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {data.category_chart.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800 dark:text-white">{item.value} Sales</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP PERFORMING PRODUCTS SECTION */}
      <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#2c2f2c] shadow-sm">
        <h3 className="font-black text-slate-800 dark:text-white text-lg mb-8 tracking-tight">
          Top Performing Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.top_products.map((prod, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#121212] border border-slate-100 dark:border-[#2c2f2c] group hover:border-orange-200 dark:hover:border-orange-900 transition-all"
            >
              <div className="w-14 h-14 bg-white dark:bg-[#1a1d1a] rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                {prod.image}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">
                  {prod.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    {prod.sales} Sold
                  </p>
                  <span className="text-[10px] font-black text-green-600 dark:text-green-400">
                    {prod.growth}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}