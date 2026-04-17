import React from 'react';
import { DollarSign, CheckCircle2, Clock, Send } from 'lucide-react';

export default function AffiliateDashboard() {
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Halo, <span className="text-[#E65100]">{adminData?.name || 'Mitra'}</span> 👋</h1>
          <p className="text-slate-400 text-sm font-medium italic">Pantau performa dan komisi kamu di sini.</p>
        </div>
        <button 
          onClick={() => alert('Fitur Request Pencairan sedang dikembangkan.')}
          className="flex items-center gap-2 bg-[#1E293B] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
        >
          <Send size={18} /> Tarik Saldo
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-5"><CheckCircle2 /></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Komisi Didapat</p>
          <h2 className="text-2xl font-black text-slate-800">{formatIDR(0)}</h2>
        </div>
        
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5"><DollarSign /></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Saldo Tersedia</p>
          <h2 className="text-2xl font-black text-slate-800">{formatIDR(0)}</h2>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-5"><Clock /></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pencairan Pending</p>
          <h2 className="text-2xl font-black text-[#E65100]">{formatIDR(0)}</h2>
        </div>
      </div>

      {/* TABLE HISTORY */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-7 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg">Riwayat Transaksi Saya</h3>
        </div>
        <div className="p-10 text-center text-slate-300 font-bold italic">
          Belum ada riwayat transaksi atau pencairan.
        </div>
      </div>
    </div>
  );
}