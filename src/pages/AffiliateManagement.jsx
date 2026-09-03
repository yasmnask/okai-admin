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
  markWithdrawalAsPaid,
} from "../services/api";

export default function AffiliateManagement() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed states
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const withdrawalHistory = withdrawals.filter(w => w.status !== 'pending');

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

  // State Modal Tanda Terima (Receipt)
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // State Modal Detail Pendaftaran Mitra
  const [selectedPendingAffiliate, setSelectedPendingAffiliate] = useState(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [resStats, resWithdraws, resList] = await Promise.all([
        getAffiliateStats(),
        getWithdrawals(),
        getAffiliateList()
      ]);

      if (resStats.success) setStats(resStats.data);
      if (resWithdraws.success) setWithdrawals(resWithdraws.data);
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

  const handleOpenReceipt = (req) => {
    setSelectedReceipt(req);
    setIsReceiptModalOpen(true);
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Tandai komisi ini sebagai SUDAH DIBAYAR (PAID)? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      setIsPaying(true);
      const res = await markWithdrawalAsPaid(id);
      if (res.success) {
        toast.success(res.message || "Status berhasil diubah menjadi PAID!");
        // Update local modal data
        setSelectedReceipt(prev => prev ? { ...prev, status: 'paid' } : null);
        // Refresh dashboard data
        loadAllData();
      } else {
        toast.error(res.message || "Gagal mengubah status.");
      }
    } catch (error) {
      toast.error(error.message || "Gagal memproses pembayaran. Hubungi admin.");
    } finally {
      setIsPaying(false);
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

  const getDisplayBankInfo = (req) => {
    if (!req) return '-';
    const bank = (req.bank_name && req.bank_name !== '-') ? req.bank_name : (req.affiliate?.bank_name || '-');
    const accNum = (req.account_number && req.account_number !== '-') ? req.account_number : (req.affiliate?.account_number || '-');
    const accHolder = (req.affiliate?.account_holder_name && req.affiliate?.account_holder_name !== '-')
      ? req.affiliate.account_holder_name
      : ((req.account_name && req.account_name !== '-') ? req.account_name : '');
      
    return `${bank} - ${accNum}${accHolder ? ` (a.n. ${accHolder})` : ''}`;
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
                          type="button"
                          onClick={() => {
                            setSelectedPendingAffiliate(aff);
                            setIsPendingModalOpen(true);
                          }}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Lihat
                        </button>
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
                      <p className="text-xs font-normal text-slate-400 mt-1">{getDisplayBankInfo(req)}</p>
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

      {/* TABLE RIWAYAT PENCAIRAN */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden mb-8 transition-colors">
        <div className="p-7 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/10 flex justify-between items-center">
          <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-3">
            <Clock className="text-slate-500" /> Riwayat Pencairan
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-6">Nama Mitra</th>
                <th className="p-6">Nominal Pengajuan</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-center">Tanda Terima</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {withdrawalHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <Inbox className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={32} />
                    <p className="text-slate-400 italic">Belum ada riwayat pencairan.</p>
                  </td>
                </tr>
              ) : (
                withdrawalHistory.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-[#3e3c3a]/20 transition-colors">
                    <td className="p-6 font-bold text-slate-800 dark:text-slate-200">
                      {req.affiliate?.full_name}
                      <p className="text-xs font-normal text-slate-400 mt-1">{getDisplayBankInfo(req)}</p>
                    </td>
                    <td className="p-6 font-black text-slate-700 dark:text-slate-300">
                      {formatIDR(req.amount)}
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : req.status === 'paid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {(req.status === 'approved' || req.status === 'paid') ? (
                        <button
                          onClick={() => handleOpenReceipt(req)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E65100] text-white text-[10px] font-black uppercase rounded-xl hover:bg-orange-600 transition-colors"
                        >
                          {req.status === 'approved' ? 'Proses & Cetak' : 'Lihat / Cetak'}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">-</span>
                      )}
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
                {/* ❌ Kolom Komisi (%) Dihapus di Sini */}
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {currentFilteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-16 text-center">
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
                    {/* ❌ Data Komisi Dihapus di Sini */}
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadgeColors(aff.status)}`}>
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/affiliate/${aff.id}`)}
                          className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#2a2d2a] rounded-xl transition-all"
                          title="Detail Mitra"
                        >
                          <ExternalLink size={18} />
                        </button>
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

      {/* MODAL TANDA TERIMA (RECEIPT MODAL) */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1d1a] rounded-[2rem] border border-slate-100 dark:border-slate-800 max-w-2xl w-full p-8 shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsReceiptModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Printable Content Wrapper */}
            <div id="print-area" className="bg-white p-6 rounded-2xl text-slate-800 font-sans">
              <style>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #print-area, #print-area * {
                    visibility: visible !important;
                  }
                  #print-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 0px !important;
                    margin: 0px !important;
                    box-shadow: none !important;
                    border: none !important;
                  }
                  .modal-actions-print {
                    display: none !important;
                  }
                }
              `}</style>
              
              <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', fontFamily: 'serif', color: '#111' }}>
                  BUKTI TANDA TERIMA PENCAIRAN KOMISI
                </h2>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#555' }}>
                  ID Request: REQ-{String(selectedReceipt.id).padStart(5, '0')}
                </p>
                <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                  STATUS: {selectedReceipt.status === 'paid' ? (
                    <span style={{ color: '#16a34a', backgroundColor: '#dcfce7', padding: '3px 10px', borderRadius: '9999px', fontSize: '10px', textTransform: 'uppercase' }}>Sudah Dibayar (PAID)</span>
                  ) : (
                    <span style={{ color: '#d97706', backgroundColor: '#fef3c7', padding: '3px 10px', borderRadius: '9999px', fontSize: '10px', textTransform: 'uppercase' }}>Disetujui (APPROVED)</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '25px', fontSize: '14px', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 15px 0' }}>Telah diserahkan komisi program affiliate kepada:</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <th style={{ textAlign: 'left', width: '35%', padding: '6px 0', fontWeight: 'bold' }}>Nama Afiliator</th>
                      <td style={{ padding: '6px 0' }}>: {selectedReceipt.affiliate?.full_name || '-'}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 'bold' }}>Kode Referral</th>
                      <td style={{ padding: '6px 0' }}>: {selectedReceipt.affiliate?.affiliate_code || '-'}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 'bold' }}>Bank / Rekening</th>
                      <td style={{ padding: '6px 0' }}>
                        : {getDisplayBankInfo(selectedReceipt)}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 'bold' }}>Tanggal Request</th>
                      <td style={{ padding: '6px 0' }}>: {selectedReceipt.created_at ? new Date(selectedReceipt.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    </tr>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '6px 0', fontWeight: 'bold' }}>Tanggal Diupdate</th>
                      <td style={{ padding: '6px 0' }}>: {selectedReceipt.updated_at ? new Date(selectedReceipt.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                padding: '15px', 
                backgroundColor: '#f8fafc', 
                border: '1px dashed #cbd5e1', 
                borderRadius: '8px',
                marginBottom: '30px',
                color: '#E65100'
              }}>
                Total Pencairan: {formatIDR(selectedReceipt.amount)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '13px' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <p style={{ margin: '0 0 50px 0' }}>Pihak Manajemen,</p>
                  <div style={{ borderBottom: '1px solid #333', margin: '0 auto 5px auto', width: '150px' }}></div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Okai Store Admin</p>
                </div>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <p style={{ margin: '0 0 50px 0' }}>Penerima,</p>
                  <div style={{ borderBottom: '1px solid #333', margin: '0 auto 5px auto', width: '150px' }}></div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{selectedReceipt.affiliate?.full_name || 'Afiliator'}</p>
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="modal-actions-print mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              {selectedReceipt.status === 'approved' && (
                <button
                  disabled={isPaying}
                  onClick={() => handleMarkAsPaid(selectedReceipt.id)}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-xs uppercase"
                >
                  {isPaying ? 'Memproses...' : 'Tandai Sudah Dibayar'}
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-xs uppercase"
              >
                Cetak ke PDF
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 transition text-xs uppercase"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETAIL PENDAFTARAN MITRA */}
      {isPendingModalOpen && selectedPendingAffiliate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1d1a] rounded-[2rem] border border-slate-100 dark:border-slate-800 max-w-lg w-full p-8 shadow-2xl relative animate-scaleUp">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsPendingModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-800/50 uppercase tracking-widest">
                Pengajuan Mitra
              </span>
              <h2 className="text-xl font-black text-slate-800 dark:text-white mt-3">
                Detail Data Pendaftar
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Tinjau informasi pendaftaran sebelum menyetujui atau menolak.
              </p>
            </div>

            <div className="space-y-4 mb-8 text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nama Lengkap</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedPendingAffiliate.full_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate" title={selectedPendingAffiliate.email}>{selectedPendingAffiliate.email || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">WhatsApp</p>
                  <p className="font-bold text-[#E65100] text-xs">{selectedPendingAffiliate.phone || "-"}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sosial Media</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    {selectedPendingAffiliate.social_platform}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPendingAffiliate.social_username}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Rencana Promosi</p>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-xs max-h-[120px] overflow-y-auto pr-1">
                  {selectedPendingAffiliate.promotional_plan || "Tidak menuliskan rencana promosi."}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  handleAffiliateAction(selectedPendingAffiliate.id, 'rejected');
                  setIsPendingModalOpen(false);
                }}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all cursor-pointer"
              >
                Tolak
              </button>
              <button
                onClick={() => {
                  handleAffiliateAction(selectedPendingAffiliate.id, 'active');
                  setIsPendingModalOpen(false);
                }}
                className="flex-1 py-3.5 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Terima
              </button>
            </div>

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