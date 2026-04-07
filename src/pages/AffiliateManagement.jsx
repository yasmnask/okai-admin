import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, TrendingUp, DollarSign, Users, 
  ExternalLink, CheckCircle2, Clock, Loader2, X, Send
} from 'lucide-react';
import { 
  getAffiliateStats, 
  getWithdrawals, 
  updateWithdrawalStatus, 
  getAffiliateList 
} from '../services/api';

export default function AffiliateManagement() {
  const [stats, setStats] = useState(null);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Modal Bayar Komisi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    affiliate_id: '',
    amount: '',
    note: ''
  });

  const loadAllData = async () => {
    try {
      const [resStats, resWithdraws, resList] = await Promise.all([
        getAffiliateStats(),
        getWithdrawals(),
        getAffiliateList()
      ]);
      
      if(resStats.success) setStats(resStats.data);
      if(resWithdraws.success) setPendingWithdrawals(resWithdraws.data);
      if(resList.success) setAffiliates(resList.data);
    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // 1. Fungsi Validasi Withdraw (Approve/Reject)
  const handleStatusUpdate = async (id, status) => {
    const confirmMsg = status === 'approved' ? "Setujui pencairan ini?" : "Tolak pencairan ini?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await updateWithdrawalStatus(id, status);
      if (res.success) {
        alert(`Berhasil di-${status}`);
        loadAllData();
      }
    } catch (error) {
      alert("Gagal memperbarui status");
    }
  };

  // 2. Fungsi Kirim Pembayaran Manual (Modal)
  const handleManualPayment = async (e) => {
    e.preventDefault();
    console.log("Kirim Pembayaran:", paymentData);
    alert(`Pembayaran sebesar Rp ${paymentData.amount} berhasil diproses!`);
    setIsModalOpen(false);
    loadAllData();
  };

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#E65100]" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">Affiliate <span className="text-[#E65100]">Management</span></h1>
          <p className="text-slate-400 text-sm font-medium italic">Monitoring Performa Mitra OKAI</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#E65100] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-900/20 hover:scale-105 transition-all"
        >
          <DollarSign size={18} /> Bayar Komisi
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Mitra" value={stats?.total_mitra} icon={<Users />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Total Referal" value={stats?.total_referrals} icon={<TrendingUp />} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Komisi Pending" value={formatIDR(stats?.pending_commissions)} icon={<Clock />} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Komisi Terbayar" value={formatIDR(stats?.paid_commissions)} icon={<CheckCircle2 />} color="text-green-600" bg="bg-green-50" />
      </div>

      {/* MODAL BAYAR KOMISI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Proses <span className="text-[#E65100]">Bayar</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleManualPayment} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Mitra</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  onChange={(e) => setPaymentData({...paymentData, affiliate_id: e.target.value})}
                  required
                >
                  <option value="">-- Pilih Partner --</option>
                  {affiliates.map(aff => <option key={aff.id} value={aff.id}>{aff.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nominal Transfer (Rp)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                  placeholder="0"
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#1E293B] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black transition-all">
                <Send size={16} /> Kirim Dana
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABLE WITHDRAWAL (PROSES APPROVE/REJECT) */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-7 border-b border-slate-50 bg-orange-50/10 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Clock className="text-[#E65100]" /> Permintaan Pencairan</h3>
          <span className="text-[10px] font-black text-[#E65100] bg-white px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">
            {pendingWithdrawals.length} Needs Action
          </span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {pendingWithdrawals.length === 0 ? (
              <tr><td className="p-10 text-center text-slate-300 font-bold italic">Tidak ada permintaan pencairan saat ini.</td></tr>
            ) : (
              pendingWithdrawals.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50">
                  <td className="p-6 font-bold text-slate-800">{req.affiliate?.full_name}</td>
                  <td className="p-6 font-black text-[#E65100]">{formatIDR(req.amount)}</td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusUpdate(req.id, 'approved')} className="px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl shadow-md shadow-green-100 hover:scale-105 transition-all">Approve</button>
                      <button onClick={() => handleStatusUpdate(req.id, 'rejected')} className="px-4 py-2 bg-slate-100 text-slate-400 text-[10px] font-black uppercase rounded-xl hover:text-red-500 transition-all">Reject</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TABLE DAFTAR PARTNER */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-7 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg">Daftar Partner OKAI</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Cari Kode atau Nama..." className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold w-64" />
          </div>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {affiliates.map(aff => (
              <tr key={aff.id} className="hover:bg-slate-50/50">
                <td className="p-6">
                  <p className="font-black text-slate-800 text-sm">{aff.full_name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{aff.affiliate_code}</p>
                </td>
                <td className="p-6 text-center font-black text-slate-600">{aff.commission_rate}%</td>
                <td className="p-6">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => alert(`Detail Mitra: ${aff.full_name}`)} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all">
                      <ExternalLink size={18} />
                    </button>
                    <button onClick={() => alert(`History Komisi: ${aff.full_name}`)} className="p-2.5 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all">
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

// Sub-component StatCard
function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-2xl font-black text-slate-800">{value || 0}</h2>
    </div>
  );
}