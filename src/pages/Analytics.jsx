import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  Download, Calendar, ArrowUpRight, ArrowDownRight, MousePointer2
} from 'lucide-react';

// Mock Data untuk Grafik
const revenueData = [
  { name: 'Week 1', revenue: 45000000, orders: 120 },
  { name: 'Week 2', revenue: 52000000, orders: 145 },
  { name: 'Week 3', revenue: 48000000, orders: 132 },
  { name: 'Week 4', revenue: 61000000, orders: 189 },
];

const categoryData = [
  { name: 'Footwear', value: 400 },
  { name: 'Accessories', value: 300 },
  { name: 'Apparel', value: 300 },
  { name: 'Electronics', value: 200 },
];

const COLORS = ['#E65100', '#FB8C00', '#FFB74D', '#FFE0B2'];

export default function Analytics() {
  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Business <span className="text-[#E65100]">Analytics</span></h1>
          <p className="text-slate-400 text-sm font-medium italic">Data-driven insights for PT Otak Kanan growth</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Calendar size={18} /> Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-[#E65100] text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-transform">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Conversion Rate', value: '3.42%', trend: '+1.2%', up: true, icon: <MousePointer2 size={20} />, bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: 'Avg. Order Value', value: 'Rp 420K', trend: '+5.4%', up: true, icon: <ShoppingBag size={20} />, bg: 'bg-purple-50', text: 'text-purple-600' },
          { label: 'Return Rate', value: '0.8%', trend: '-0.2%', up: true, icon: <ArrowDownRight size={20} />, bg: 'bg-red-50', text: 'text-red-600' },
          { label: 'New Customers', value: '124', trend: '+12%', up: true, icon: <Users size={20} />, bg: 'bg-orange-50', text: 'text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bg} ${stat.text} rounded-2xl`}>{stat.icon}</div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 text-slate-800 tracking-tight">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* REVENUE CHART */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 text-lg">Revenue Growth</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                <div className="w-2 h-2 rounded-full bg-[#E65100]"></div> Income
              </span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E65100" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E65100" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#E65100" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY PIE CHART */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 text-lg mb-8">Sales by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{item.value} Sales</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP PRODUCTS SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-800 text-lg mb-8 tracking-tight">Top Performing Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Sepatu Lari Pro-X', sales: 452, growth: '+12%', image: '👟' },
            { name: 'Tas Ransel Outdoor', sales: 321, growth: '+8%', image: '🎒' },
            { name: 'Jaket Windbreaker', sales: 289, growth: '+15%', image: '🧥' },
          ].map((prod, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-orange-200 transition-all">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                {prod.image}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{prod.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">{prod.sales} Sold</p>
                  <span className="text-[10px] font-black text-green-600">{prod.growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}