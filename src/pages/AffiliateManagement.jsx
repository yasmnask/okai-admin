import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import {
  Search,
  TrendingUp,
  DollarSign,
  Users,
  ExternalLink,
  CheckCircle2,
  Clock,
  Loader2,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Inbox
} from "lucide-react";
import {
  getAffiliateStats,
  getWithdrawals,
  updateWithdrawalStatus,
  getAffiliateList,
  updateAffiliateStatus,
} from "../services/api";

export default function AffiliateManagement() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Paginasi
  const [affiliatePage, setAffiliatePage] = useState(1);
  const [affiliatePerPage, setAffiliatePerPage] = useState(10);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPerPage, setPendingPerPage] = useState(10);

  // State Filter & Search
  const [searchAffiliate, setSearchAffiliate] = useState("");
  const [statusFilterAffiliate, setStatusFilterAffiliate] = useState("All");

  // State Modal Bayar Komisi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    affiliate_id: "",
    amount: "",
    note: "",
  });

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [resStats, resWithdraws, resList] = await Promise.all([
        getAffiliateStats(),
        getWithdrawals(),
        getAffiliateList(),
      ]);

      if (resStats.success) setStats(resStats.data);
      if (resWithdraws.success) setPendingWithdrawals(resWithdraws.data);
      if (resList.success) setAffiliates(resList.data);
    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
      toast.error("Gagal sinkronisasi data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ==========================================
  // PENGELOMPOKAN & PENYARINGAN DATA
  // ==========================================
  const pendingAffiliates = affiliates.filter((aff) => aff.status === 'pending');
  const totalActiveMitra = affiliates.filter((aff) => aff.status === 'active').length;

  const filteredAffiliatesList = affiliates.filter((aff) => {
    if (aff.status === 'pending') return false;
    if (statusFilterAffiliate === "All" && aff.status === "rejected") return false;
    const matchStatus = statusFilterAffiliate === "All" || aff.status === statusFilterAffiliate;
    const matchSearch =
      aff.full_name?.toLowerCase().includes(searchAffiliate.toLowerCase()) ||
      aff.affiliate_code?.toLowerCase().includes(searchAffiliate.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Paginasi
  const indexOfLastPending = pendingPage * pendingPerPage;
  const indexOfFirstPending = indexOfLastPending - pendingPerPage;
  const currentPendingAffiliates = pendingAffiliates.slice(indexOfFirstPending, indexOfLastPending);
  const totalPendingPages = Math.ceil(pendingAffiliates.length / pendingPerPage);

  const indexOfLastAffiliate = affiliatePage * affiliatePerPage;
  const indexOfFirstAffiliate = indexOfLastAffiliate - affiliatePerPage;
  const currentFilteredAffiliates = filteredAffiliatesList.slice(indexOfFirstAffiliate, indexOfLastAffiliate);
  const totalAffiliatePages = Math.ceil(filteredAffiliatesList.length / affiliatePerPage);

  // ==========================================
  // FUNGSI AKSI & TOMBOL
  // ==========================================
  const handleAffiliateAction = async (id, action) => {
    const statusText = action === 'active' ? 'Menerima' : 'Menolak';
    if (window.confirm(`Yakin ingin ${statusText} mitra ini?`)) {
      try {
        setIsLoading(true);
        const res = await updateAffiliateStatus(id, action);
        if (res.success) {
          toast.success(`Mitra berhasil di-${action === 'active' ? 'terima' : 'tolak'}!`);
          loadAllData(); // Segarkan data tabel
        }
      } catch (error) {
        toast.error("Gagal memproses aksi. Pastikan backend sudah terhubung.");
        setIsLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const confirmMsg = status === "approved" ? "Setujui pencairan ini?" : "Tolak pencairan ini?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await updateWithdrawalStatus(id, status);
      if (res.success) {
        toast.success(`Berhasil di-${status}`);
        loadAllData();
      }
    } catch (error) {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleManualPayment = async (e) => {
    e.preventDefault();
    toast.success(`Pembayaran sebesar Rp ${paymentData.amount} berhasil diproses!`);
    setIsModalOpen(false);
    loadAllData();
  };

  const formatIDR = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  // Helper untuk warna badge status
  const getStatusBadgeColors = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#1a1e1a]">
        <Loader2 className="animate-spin text-[#E65100]" size={40} />
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] dark:text-white">
            Affiliate <span className="text-[#E65100]">Management</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">
            Monitoring Performa Mitra OKAI
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#E65100] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-900/20 dark:shadow-black/50 hover:scale-105 transition-all"
        >
          <DollarSign size={18} /> Bayar Komisi
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Mitra"
          value={totalActiveMitra}
          icon={<Users />}
          color="text-blue-600"
          bg="bg-blue-50"
          darkBg="dark:bg-blue-900/30"
          darkColor="dark:text-blue-400"
        />
        <StatCard
          label="Total Referal"
          value={stats?.total_referrals}
          icon={<TrendingUp />}
          color="text-purple-600"
          bg="bg-purple-50"
          darkBg="dark:bg-purple-900/30"
          darkColor="dark:text-purple-400"
        />
        <StatCard
          label="Komisi Pending"
          value={formatIDR(stats?.pending_commissions)}
          icon={<Clock />}
          color="text-orange-600"
          bg="bg-orange-50"
          darkBg="dark:bg-orange-900/30"
          darkColor="dark:text-orange-400"
        />
        <StatCard
          label="Komisi Terbayar"
          value={formatIDR(stats?.paid_commissions)}
          icon={<CheckCircle2 />}
          color="text-green-600"
          bg="bg-green-50"
          darkBg="dark:bg-green-900/30"
          darkColor="dark:text-green-400"
        />
      </div>

      {/* TABEL 1: PENDAFTARAN MITRA BARU */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden mb-8 transition-colors">
        <div className="p-7 border-b border-slate-50 dark:border-slate-800/50 bg-blue-50/30 dark:bg-blue-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-black text-slate-800 dark:text-white text-lg">
              Pendaftaran Mitra Baru
            </h3>
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800 uppercase tracking-widest">
              {pendingAffiliates.length} Menunggu
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tampilkan:</span>
            <select
              value={pendingPerPage}
              onChange={(e) => {
                setPendingPerPage(Number(e.target.value));
                setPendingPage(1);
              }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg p-1 outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-6">Informasi Mitra</th>
                <th className="p-6">Sosial Media & Rencana</th>
                <th className="p-6">Tanggal Daftar</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {currentPendingAffiliates.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <Inbox className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={32} />
                    <p className="text-slate-400 italic">Tidak ada pendaftaran baru.</p>
                  </td>
                </tr>
              ) : (
                currentPendingAffiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-slate-50/50 dark:hover:bg-[#3e3c3a]/20 transition-colors">
                    <td className="p-6 align-top">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{aff.full_name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                        {aff.email || "No Email"}
                      </p>
                      <p className="text-xs font-bold text-[#E65100] mt-0.5">
                        {aff.phone || "No Phone"}
                      </p>
                    </td>

                    <td className="p-6 align-top w-[45%] max-w-xs whitespace-normal">
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                            {aff.social_platform}
                          </span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            {aff.social_username}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed line-clamp-2" title={aff.promotional_plan}>
                          {aff.promotional_plan || "Tidak menuliskan rencana promosi."}
                        </p>
                      </div>
                    </td>

                    <td className="p-6 font-semibold text-slate-500 dark:text-slate-400 text-sm align-top">
                      {aff.created_at ? new Date(aff.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                    </td>

                    <td className="p-6 align-top">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleAffiliateAction(aff.id, 'active')}
                          className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-md shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-colors"
                        >
                          Terima
                        </button>
                        <button
                          onClick={() => handleAffiliateAction(aff.id, 'rejected')}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPendingPages > 1 && (
          <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/30 dark:bg-[#1a1d1a]">
            <span className="text-xs font-semibold text-slate-400">
              Halaman {pendingPage} dari {totalPendingPages}
            </span>
            <div className="flex gap-2">
              <button disabled={pendingPage === 1} onClick={() => setPendingPage(prev => prev - 1)} className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft size={16} /></button>
              <button disabled={pendingPage === totalPendingPages} onClick={() => setPendingPage(prev => prev + 1)} className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE WITHDRAWAL */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden mb-8 transition-colors">
        <div className="p-7 border-b border-slate-50 dark:border-slate-800/50 bg-orange-50/10 dark:bg-orange-900/10 flex justify-between items-center">
          <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-3">
            <Clock className="text-[#E65100]" /> Permintaan Pencairan
          </h3>
          <span className="text-[10px] font-black text-[#E65100] dark:text-orange-400 bg-white dark:bg-orange-900/30 px-3 py-1 rounded-lg border border-orange-100 dark:border-orange-800/50 uppercase tracking-widest">
            {pendingWithdrawals.length} Needs Action
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-6">Nama Mitra</th>
                <th className="p-6">Nominal Pengajuan</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {pendingWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-16 text-center">
                    <CheckCircle2 className="mx-auto mb-3 text-green-400 dark:text-green-600" size={32} />
                    <p className="text-slate-400 italic">Tidak ada permintaan pencairan saat ini.</p>
                  </td>
                </tr>
              ) : (
                pendingWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-[#3e3c3a]/20 transition-colors">
                    <td className="p-6 font-bold text-slate-800 dark:text-slate-200">
                      {req.affiliate?.full_name}
                      <p className="text-xs font-normal text-slate-400 mt-1">{req.bank_name} - {req.account_number}</p>
                    </td>
                    <td className="p-6 font-black text-[#E65100] dark:text-orange-400">
                      {formatIDR(req.amount)}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleStatusUpdate(req.id, "approved")}
                          className="px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl shadow-md shadow-green-100 dark:shadow-none hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req.id, "rejected")}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE DAFTAR PARTNER */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden transition-colors">
        <div className="p-7 border-b border-slate-50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-black text-slate-800 dark:text-white text-lg shrink-0">
            Daftar Partner OKAI
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Paginator Limit Control */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 font-semibold hidden md:block">Tampilkan:</span>
              <select
                value={affiliatePerPage}
                onChange={(e) => {
                  setAffiliatePerPage(Number(e.target.value));
                  setAffiliatePage(1);
                }}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-xl px-2 py-2 outline-none font-bold"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={statusFilterAffiliate}
                onChange={(e) => {
                  setStatusFilterAffiliate(e.target.value);
                  setAffiliatePage(1);
                }}
                className="bg-slate-50 dark:bg-[#2a2d2a] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="All">Semua Status</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500" size={16} />
              <input
                type="text"
                value={searchAffiliate}
                onChange={(e) => {
                  setSearchAffiliate(e.target.value);
                  setAffiliatePage(1);
                }}
                placeholder="Cari Kode atau Nama..."
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold w-full md:w-56 focus:ring-2 focus:ring-orange-500/20 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-6">Informasi Mitra</th>
                <th className="p-6 text-center">Komisi (%)</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {currentFilteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <Search className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={32} />
                    <p className="text-slate-400 italic">Tidak ada partner yang cocok.</p>
                  </td>
                </tr>
              ) : (
                currentFilteredAffiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-slate-50/50 dark:hover:bg-[#3e3c3a]/20 transition-colors">
                    <td className="p-6">
                      <p className="font-black text-slate-800 dark:text-slate-200 text-sm">
                        {aff.full_name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                        {aff.affiliate_code || "BELUM ADA KODE"}
                      </p>
                    </td>
                    <td className="p-6 text-center font-black text-slate-600 dark:text-slate-400">
                      {aff.commission_rate}%
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadgeColors(aff.status)}`}>
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        {/* Tombol Detail Mitra - Langsung berpindah ke halaman detail */}
                        <button
                          onClick={() => navigate(`/affiliate/${aff.id}`)}
                          className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#2a2d2a] rounded-xl transition-all"
                          title="Detail Mitra"
                        >
                          <ExternalLink size={18} />
                        </button>

                        {/* Tombol History Komisi */}
                        <button
                          onClick={() => toast('Fitur History Komisi untuk ' + aff.full_name + ' sedang dalam tahap pengembangan.', { icon: 'ℹ️' })}
                          className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-[#E65100] dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-[#2a2d2a] rounded-xl transition-all"
                          title="Riwayat Komisi"
                        >
                          <DollarSign size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalAffiliatePages > 1 && (
          <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/30 dark:bg-[#1a1d1a]">
            <span className="text-xs font-semibold text-slate-400">
              Halaman {affiliatePage} dari {totalAffiliatePages}
            </span>
            <div className="flex gap-2">
              <button disabled={affiliatePage === 1} onClick={() => setAffiliatePage(prev => prev - 1)} className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft size={16} /></button>
              <button disabled={affiliatePage === totalAffiliatePages} onClick={() => setAffiliatePage(prev => prev + 1)} className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL BAYAR KOMISI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1d1a] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border dark:border-slate-800/50 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 dark:text-white">
                Proses <span className="text-[#E65100]">Bayar</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualPayment} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Pilih Mitra</label>
                <select
                  className="w-full p-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  onChange={(e) => setPaymentData({ ...paymentData, affiliate_id: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Partner --</option>
                  {affiliates.filter(a => a.status === 'active').map((aff) => (
                    <option key={aff.id} value={aff.id}>{aff.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Nominal Transfer (Rp)</label>
                <input
                  type="number"
                  className="w-full p-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="0"
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#1E293B] dark:bg-white dark:text-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-slate-200 transition-all">
                <Send size={16} /> Kirim Dana
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, darkBg, darkColor }) {
  return (
    <div className="bg-white dark:bg-[#1a1d1a] p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors">
      <div className={`w-12 h-12 ${bg} ${color} ${darkBg} ${darkColor} rounded-2xl flex items-center justify-center mb-5 transition-colors`}>
        {icon}
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
        {label}
      </p>
      <h2 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">{value || 0}</h2>
    </div>
  );
}