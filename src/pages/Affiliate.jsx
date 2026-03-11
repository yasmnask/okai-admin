import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Handshake, Search, Filter, TrendingUp, DollarSign, Users, 
  ExternalLink, CheckCircle2, Clock, AlertCircle, ChevronRight, Wallet
} from 'lucide-react';

export default function Affiliate() {
  const navigate = useNavigate();

  // Mock Data Mitra Afiliasi
  const [affiliates] = useState([
    { id: 1, name: 'Dhandi Ramadhan', code: 'OKAI-DHAN01', referrals: 124, totalSales: 'Rp 45.200.000', commission: 'Rp 4.520.000', status: 'Active' },
    { id: 2, name: 'Andi Pratama', code: 'OKAI-ANDI99', referrals: 56, totalSales: 'Rp 12.800.000', commission: 'Rp 1.280.000', status: 'Pending' },
    { id: 3, name: 'Siska Putri', code: 'OKAI-SISK22', referrals: 89, totalSales: 'Rp 28.450.000', commission: 'Rp 2.845.000', status: 'Active' },
  ]);

  // BAGAN BARU: List Pending Komisi (Withdrawal Requests)
  const [pendingWithdrawals] = useState([
    { id: 1, name: 'Dhandi Ramadhan', amount: 'Rp 1.500.000', date: '10 Mar 2026', method: 'Transfer BCA' },
    { id: 2, name: 'Siska Putri', amount: 'Rp 2.000.000', date: '09 Mar 2026', method: 'GoPay' },
  ]);

  const stats = [
    { label: 'Total Mitra', value: '482', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Referal', value: '3,120', icon: <TrendingUp size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Komisi Pending', value: 'Rp 8.4M', icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Komisi Terbayar', value: 'Rp 152.5M', icon: <CheckCircle2 size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Affiliate <span className="text-[#E65100]">Management</span></h1>
          <p className="text-slate-400 text-sm font-medium italic uppercase tracking-wider">Monitoring Performa Mitra OKAI</p>
        </div>
        <button className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-transform">
          <DollarSign size={20} /> Bayar Komisi
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-2xl font-black mt-1 text-slate-800">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* BAGAN BARU: LIST PENDING KOMISI / WITHDRAWAL REQUESTS */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-orange-50/10">
           <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
             <Clock className="text-[#E65100]" size={20} /> Permintaan Pencairan Komisi
           </h3>
           <span className="px-3 py-1 bg-white border border-orange-100 text-[#E65100] text-[10px] font-black rounded-lg uppercase tracking-widest">
             {pendingWithdrawals.length} Needs Action
           </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Mitra</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Nominal</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Metode</th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Aksi Validasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pendingWithdrawals.map((req) => (
              <tr key={req.id} className="hover:bg-orange-50/20 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-800 text-sm">{req.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{req.date}</p>
                </td>
                <td className="p-6 font-black text-[#E65100] text-sm">{req.amount}</td>
                <td className="p-6 text-xs font-bold text-slate-500 uppercase">{req.method}</td>
                <td className="p-6 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl hover:brightness-110 shadow-md shadow-green-100">Approve</button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLE SECTION: DAFTAR MITRA AFILIASI (Sesuai Gambar Kamu) */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-black text-slate-800 text-lg tracking-tight">Daftar Mitra Afiliasi</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Cari Kode..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 outline-none w-48 font-medium" />
            </div>
            <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-[#E65100] transition-all border border-slate-100">
              <Filter size={20} />
            </button>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mitra</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kode Unik</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Referal</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Komisi</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {affiliates.map((aff) => (
              <tr key={aff.id} className="hover:bg-orange-50/20 transition-colors group">
                <td className="p-6 font-bold text-slate-800 text-sm">{aff.name}</td>
                <td className="p-6 text-center">
                  <span className="text-[10px] font-black text-[#E65100] bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-wider font-mono">
                    {aff.code}
                  </span>
                </td>
                <td className="p-6 text-center font-bold text-slate-600 text-sm">{aff.referrals}</td>
                <td className="p-6 font-bold text-slate-800 text-sm">{aff.totalSales}</td>
                <td className="p-6 font-black text-[#E65100] text-sm">{aff.commission}</td>
                <td className="p-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    aff.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {aff.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <DollarSign size={18} />
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