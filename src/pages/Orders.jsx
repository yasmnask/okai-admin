import React, { useState } from 'react';
import { 
  Package, Search, Filter, Eye, Truck, 
  CheckCircle2, Clock, XCircle, ShoppingBag, 
  MoreVertical, Calendar, User, MapPin
} from 'lucide-react';

export default function Orders() {
  // Mock Data Pesanan - Mengikuti alur trigger komisi setelah Delivered
  const [orders] = useState([
    { 
      id: 'ORD-2026-1001', 
      customer: 'Budi Santoso', 
      items: 'Sepatu Lari Pro-X (1x)', 
      total: 'Rp 850.000', 
      method: 'JNE Reguler',
      status: 'Delivered', // Ini akan men-trigger komisi di flowchart
      date: '10 Mar 2026' 
    },
    { 
      id: 'ORD-2026-1002', 
      customer: 'Siti Aminah', 
      items: 'Tas Ransel Outdoor (1x)', 
      total: 'Rp 450.000', 
      method: 'SiCepat Best',
      status: 'Processing',
      date: '10 Mar 2026' 
    },
    { 
      id: 'ORD-2026-1003', 
      customer: 'Andi Pratama', 
      items: 'Jaket Windbreaker (2x)', 
      total: 'Rp 1.100.000', 
      method: 'Ambil di Gudang',
      status: 'Pending',
      date: '09 Mar 2026' 
    },
  ]);

  const orderStats = [
    { label: 'Total Pesanan', value: '1,540', icon: <ShoppingBag size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Sedang Diproses', value: '42', icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Dalam Pengiriman', value: '86', icon: <Truck size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Selesai/Tiba', value: '1,412', icon: <CheckCircle2 size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Order <span className="text-[#E65100]">Management</span></h1>
          <p className="text-slate-400 text-sm font-medium italic">Status "Delivered" otomatis memicu perhitungan komisi</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Calendar size={18} /> Pilih Tanggal
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {orderStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 text-slate-800">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 items-center">
          <h3 className="font-black text-slate-800 text-lg">Recent Orders</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari No. Pesanan atau Nama..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 outline-none md:w-64 font-medium" 
              />
            </div>
            <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-[#E65100] transition-all border border-slate-100">
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID & Date</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Items</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Shipping</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-orange-50/20 transition-colors group">
                <td className="p-6">
                  <p className="font-black text-[#E65100] text-[11px] tracking-wider uppercase">{order.id}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{order.date}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={14} />
                    </div>
                    <p className="font-bold text-slate-800">{order.customer}</p>
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-medium text-slate-600 line-clamp-1">{order.items}</p>
                  <p className="font-black text-slate-800 text-xs mt-1">{order.total}</p>
                </td>
                <td className="p-6 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{order.method}</span>
                    <MapPin size={12} className="text-slate-300" />
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1 ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle2 size={12}/> : 
                     order.status === 'Processing' ? <Package size={12}/> : <Clock size={12}/>}
                    {order.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}