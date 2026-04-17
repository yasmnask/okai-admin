import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Search,
  MapPin,
  Package,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Box,
} from "lucide-react";

export default function Logistics() {
  const navigate = useNavigate();
  const [searchResi, setSearchResi] = useState("");

  // Mock Data Pengiriman Aktif
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

  // Mock Data Timeline (Detail Perjalanan Barang)
  const trackingHistory = [
    {
      status: "Pesanan Diterima",
      location: "Gudang Utama Surabaya",
      time: "09 Mar 2026, 10:00",
      done: true,
    },
    {
      status: "Sedang Dikemas",
      location: "Gudang Utama Surabaya",
      time: "09 Mar 2026, 14:30",
      done: true,
    },
    {
      status: "Dalam Perjalanan ke Jakarta",
      location: "Transit Semarang",
      time: "10 Mar 2026, 02:00",
      done: true,
    },
    {
      status: "Sampai di Gudang Transit",
      location: "Jakarta Selatan",
      time: "10 Mar 2026, 15:45",
      done: false,
    },
    {
      status: "Kurir Menuju Lokasi",
      location: "Jakarta Selatan",
      time: "Estimasi Besok",
      done: false,
    },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER DENGAN TOMBOL BACK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#E65100] hover:shadow-md transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1E293B]">
              Shipping <span className="text-[#E65100]">Logistics</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium italic">
              Monitoring alur distribusi PT Otak Kanan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT: DAFTAR PENGIRIMAN */}
        <div className="xl:col-span-2 space-y-6">
          {/* Search Resi */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative">
            <Search
              className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Masukkan Nomor Resi (Contoh: OKAI-9921)..."
              className="w-full pl-14 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-bold"
              value={searchResi}
              onChange={(e) => setSearchResi(e.target.value)}
            />
          </div>

          {/* List Shipments */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-black text-slate-800 tracking-tight">
                Active Shipments
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {shipments.map((ship) => (
                <div
                  key={ship.id}
                  className="p-6 hover:bg-orange-50/30 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#E65100] shadow-sm group-hover:scale-110 transition-transform">
                        <Truck size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#E65100] tracking-widest uppercase">
                          {ship.resi}
                        </p>
                        <p className="font-bold text-slate-800">{ship.item}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Customer: {ship.customer}
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          ship.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {ship.status}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center md:justify-end">
                        <MapPin size={10} className="mr-1" />{" "}
                        {ship.lastLocation}
                      </p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-slate-300 hidden md:block"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: TRACKING TIMELINE (MOCKUP JNE STYLE) */}
        <div className="bg-white border border-slate-100 overflow-hidden p-8 rounded-[3rem] text-white shadow-xl h-fit sticky top-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-500 rounded-2xl text-white">
              <Box size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg leading-tight">
                Detail Tracking
              </h3>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                Resi: OKAI-9921044
              </p>
            </div>
          </div>

          <div className="relative space-y-8 ml-2">
            {trackingHistory.map((step, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {/* Line connector */}
                {idx !== trackingHistory.length - 1 && (
                  <div
                    className={`absolute left-3 top-7 bottom-[-32px] w-[2px] ${step.done ? "bg-orange-500" : "bg-slate-700"}`}
                  ></div>
                )}

                {/* Dot */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 border-4 border-[#1E293B] ${
                    step.done ? "bg-orange-500" : "bg-slate-800"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 size={12} className="text-white" />
                  ) : (
                    <Clock size={12} className="text-slate-500" />
                  )}
                </div>

                <div>
                  <p
                    className={`text-sm font-black ${step.done ? "text-slate-800" : "text-slate-500"}`}
                  >
                    {step.status}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {step.location}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold italic">
                    {step.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-4 bg-orange-500 hover:bg-orange-600 transition-all rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-900/20">
            Cetak Label Pengiriman
          </button>
        </div>
      </div>
    </div>
  );
}
