import React from 'react';
import { DollarSign, CheckCircle2, Clock, Send } from 'lucide-react';

export default function AffiliateDashboard() {
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans transition-colors">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] dark:text-white transition-colors">
            Halo, <span className="text-[#E65100]">{adminData?.name || 'Mitra'}</span> 👋
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic transition-colors">
            Pantau performa dan komisi kamu di sini.
          </p>
        </div>
        <button 
          onClick={() => alert('Fitur Request Pencairan sedang dikembangkan.')}
          className="flex items-center gap-2 bg-[#1E293B] dark:bg-white text-white dark:text-[#1E293B] px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-900/20 dark:shadow-black/50 hover:scale-105 dark:hover:bg-slate-200 transition-all"
        >
          <Send size={18} /> Tarik Saldo
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1d1a] p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-5 transition-colors">
            <CheckCircle2 />
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 transition-colors">
            Total Komisi Didapat
          </p>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">
            {formatIDR(0)}
          </h2>
        </div>
        
        <div className="bg-white dark:bg-[#1a1d1a] p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 transition-colors">
            <DollarSign />
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 transition-colors">
            Saldo Tersedia
          </p>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">
            {formatIDR(0)}
          </h2>
        </div>

        <div className="bg-white dark:bg-[#1a1d1a] p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-5 transition-colors">
            <Clock />
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 transition-colors">
            Pencairan Pending
          </p>
          <h2 className="text-2xl font-black text-[#E65100] dark:text-orange-400 transition-colors">
            {formatIDR(0)}
          </h2>
        </div>
      </div>

      {/* TABLE HISTORY */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden transition-colors">
        <div className="p-7 border-b border-slate-50 dark:border-slate-800/50 flex justify-between items-center transition-colors">
          <h3 className="font-black text-slate-800 dark:text-white text-lg transition-colors">
            Riwayat Transaksi Saya
          </h3>
        </div>
        <div className="p-10 text-center text-slate-300 dark:text-slate-600 font-bold italic transition-colors">
          Belum ada riwayat transaksi atau pencairan.
        </div>
      </div>
    </div>
  );
}