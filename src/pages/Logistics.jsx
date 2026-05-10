import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Search,
  MapPin,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Box,
  Loader2,
} from "lucide-react";
import { trackResi } from "../services/api"; // Pastikan path ini sesuai

export default function Logistics() {
  const navigate = useNavigate();
  
  // State untuk Pencarian
  const [searchResi, setSearchResi] = useState("");
  const [courier, setCourier] = useState("jne");
  
  // State untuk Hasil Tracking
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Data Pengiriman Aktif (Tetap dibiarkan untuk list sebelah kiri)
  const shipments = [
    {
      id: 1,
      resi: "OKAI-9921044",
      item: "Sepatu Lari Pro-X",
      customer: "Budi Santoso",
      status: "In Transit",
      lastLocation: "Gudang Transit Jakarta",
      updated: "10 Menit yang lalu",
    },
    {
      id: 2,
      resi: "OKAI-8812201",
      item: "Tas Ransel Outdoor",
      customer: "Siti Aminah",
      status: "Delivered",
      lastLocation: "Penerima (Surabaya)",
      updated: "2 Jam yang lalu",
    },
  ];

  // Fungsi Eksekusi Pencarian
  const handleSearch = async (e) => {
    e.preventDefault(); // Mencegah reload jika menggunakan form
    if (!searchResi) {
      alert("Silakan masukkan nomor resi terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    setTrackingData(null);

    try {
      const response = await trackResi(searchResi, courier);
      if (response.success) {
        setTrackingData(response.data);
      } else {
        alert(response.message || "Data resi tidak ditemukan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server logistik.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen transition-colors">
      {/* HEADER DENGAN TOMBOL BACK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2.5 bg-white dark:bg-[#2a2d2a] border border-slate-100 dark:border-transparent rounded-xl text-slate-400 hover:text-[#E65100] transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-white">
              Shipping <span className="text-[#E65100]">Logistics</span>
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">
              Monitoring alur distribusi PT Otak Kanan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT: DAFTAR PENGIRIMAN */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Form Pencarian Resi Nyata */}
          <form 
            onSubmit={handleSearch} 
            className="bg-white dark:bg-[#1a1d1a] p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row gap-3 items-center"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Masukkan Nomor Resi (Cth: JT123456789)..."
                className="w-full pl-14 pr-4 py-3.5 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none font-medium"
                value={searchResi}
                onChange={(e) => setSearchResi(e.target.value)}
              />
            </div>
            
            <select 
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="py-3.5 px-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl outline-none font-bold text-sm w-full md:w-auto"
            >
              <option value="jne">JNE</option>
              <option value="jnt">J&T Express</option>
              <option value="sicepat">SiCepat</option>
              <option value="anteraja">AnterAja</option>
              <option value="spx">Shopee Express</option>
            </select>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-[#E65100] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16}/> : "Lacak"}
            </button>
          </form>

          {/* List Shipments (Data Mockup untuk Visualisasi) */}
          <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800/50">
              <h3 className="font-black text-slate-800 dark:text-white tracking-tight">
                Active Shipments
              </h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {shipments.map((ship) => (
                <div key={ship.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-[#2a2d2a]/50 transition-all group cursor-pointer">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-[#E65100] border border-slate-100 dark:border-transparent rounded-2xl flex items-center justify-center text-[#E65100] dark:text-white shadow-sm group-hover:scale-110 transition-transform">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#E65100] tracking-widest uppercase">
                          {ship.resi}
                        </p>
                        <p className="font-bold text-slate-800 dark:text-white">
                          {ship.item}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Customer: {ship.customer}
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ship.status === "Delivered" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                        {ship.status}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center md:justify-end">
                        <MapPin size={10} className="mr-1" /> {ship.lastLocation}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 hidden md:block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: TRACKING TIMELINE (HASIL BINDERBYTE) */}
        <div className="bg-white dark:bg-[#1a1d1a] border border-slate-100 dark:border-slate-800/50 p-8 rounded-[3rem] shadow-sm h-fit sticky top-28 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-500 rounded-2xl text-white">
              <Box size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white text-lg leading-tight">
                Detail Tracking
              </h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                {trackingData ? trackingData.summary.awb : "MASUKKAN RESI"}
              </p>
            </div>
          </div>

          <div className="relative space-y-8 ml-2">
            {!trackingData && !isLoading && (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 font-medium text-sm italic">
                Informasi perjalanan barang akan muncul di sini.
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-[#E65100]" size={32} />
              </div>
            )}

            {/* Pemetaan Data Nyata dari Binderbyte */}
            {trackingData && trackingData.history.map((step, idx) => {
              // Menentukan apakah statusnya sudah selesai/terkirim
              const isDelivered = trackingData.summary.status.toLowerCase().includes("delivered");
              // Asumsi index 0 adalah update terbaru (paling atas timeline)
              const isLatest = idx === 0; 
              
              return (
                <div key={idx} className="flex gap-4 relative">
                  {/* Garis Penghubung */}
                  {idx !== trackingData.history.length - 1 && (
                    <div className="absolute left-3 top-7 bottom-[-32px] w-[2px] bg-slate-200 dark:bg-slate-700"></div>
                  )}

                  {/* Titik Lingkaran */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-white dark:border-[#1a1d1a] ${isLatest ? "bg-orange-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                    {isLatest && isDelivered ? (
                      <CheckCircle2 size={12} className="text-white" />
                    ) : (
                      <Clock size={12} className={isLatest ? "text-white" : "text-slate-400"} />
                    )}
                  </div>

                  {/* Teks Keterangan */}
                  <div className="pb-2">
                    <p className={`text-sm font-black ${isLatest ? "text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                      {step.desc}
                    </p>
                    {step.location && (
                      <p className="text-xs text-slate-400 font-medium">
                        {step.location}
                      </p>
                    )}
                    <p className="text-[10px] text-[#E65100] mt-1 font-bold italic">
                      {step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {trackingData && (
             <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
               <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-1">Status Pengiriman</p>
               <p className="text-sm font-bold text-slate-800 dark:text-white">{trackingData.summary.status}</p>
               {trackingData.summary.receiver && (
                 <p className="text-xs font-medium text-slate-500 mt-2">Diterima oleh: {trackingData.summary.receiver}</p>
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}