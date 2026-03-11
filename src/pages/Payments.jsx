import React, { useState } from 'react';
import { 
  CreditCard, DollarSign, Search, Filter, 
  ArrowUpRight, ArrowDownLeft, Eye, Download, 
  CheckCircle2, Clock, AlertCircle, Calendar
} from 'lucide-react';

export default function Payments() {
  // Mock Data Transaksi - Siap dihubungkan ke Midtrans/Xendit API nantinya
  const [transactions] = useState([
    { 
      id: 'TRX-20260310-001', 
      customer: 'Budi Santoso', 
      amount: 'Rp 850.000', 
      method: 'GoPay', 
      status: 'Success', 
      date: '10 Mar 2026, 14:20' 
    },
    { 
      id: 'TRX-20260310-002', 
      customer: 'Siti Aminah', 
      amount: 'Rp 450.000', 
      method: 'Bank Transfer (BCA)', 
      status: 'Pending', 
      date: '10 Mar 2026, 15:05' 
    },
    { 
      id: 'TRX-20260309-098', 
      customer: 'Andi Pratama', 
      amount: 'Rp 1.250.000', 
      method: 'Credit Card', 
      status: 'Failed', 
      date: '09 Mar 2026, 21:10' 
    },
  ]);

  const financeStats = [
    { label: 'Total Pendapatan', value: 'Rp 128.5M', icon: <ArrowUpRight size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pembayaran Pending', value: 'Rp 12.4M', icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Refund', value: 'Rp 2.1M', icon: <ArrowDownLeft size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Transaksi Sukses', value: '1,240', icon: <CheckCircle2 size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION (NO BACK BUTTON) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Payment <span className="text-[#E65100]">Management</span></h1>
          <p className="text-slate-400 text-sm font-medium italic">Monitoring transaksi dan rekonsiliasi keuangan OKAI</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1E293B] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
          <Download size={20} /> Export Laporan (.csv)
        </button>
      </div>

      {/* FINANCE STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {financeStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 text-slate-800 tracking-tight">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 items-center">
          <h3 className="font-black text-slate-800 text-lg">Riwayat Transaksi Terkini</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari ID Transaksi..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 outline-none md:w-64" 
              />
            </div>
            <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-[#E65100] transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Method</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-orange-50/20 transition-colors group">
                <td className="p-6">
                  <p className="font-black text-[#E65100] text-[11px] tracking-wider uppercase">{trx.id}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                    <Calendar size={10} /> {trx.date}
                  </p>
                </td>
                <td className="p-6">
                  <p className="font-bold text-slate-800 text-sm">{trx.customer}</p>
                </td>
                <td className="p-6 font-black text-slate-800 text-sm">{trx.amount}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                    <CreditCard size={14} className="text-slate-400" />
                    {trx.method}
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1 ${
                    trx.status === 'Success' ? 'bg-green-100 text-green-600' : 
                    trx.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {trx.status === 'Success' ? <CheckCircle2 size={12} /> : 
                     trx.status === 'Pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                    {trx.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm" title="Detail Transaksi">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm" title="Download Kwitansi">
                      <Download size={18} />
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