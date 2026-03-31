import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  Percent,
  MousePointer2,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function Promotions() {
  const navigate = useNavigate();
  // Mock Data Promosi - Siap dihubungkan ke API Laravel
  const [promotions] = useState([
    {
      id: 1,
      code: "OKAI-MERDEKA",
      type: "Percentage",
      value: "15%",
      limit: "500",
      used: "124",
      expiry: "31 Aug 2026",
      status: "Active",
    },
    {
      id: 2,
      code: "HEMAT-DHANDI",
      type: "Fixed Amount",
      value: "Rp 50.000",
      limit: "100",
      used: "100",
      expiry: "10 Mar 2026",
      status: "Expired",
    },
  ]);

  const promoStats = [
    {
      label: "Total Kupon",
      value: "24",
      icon: <Ticket size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Kupon Aktif",
      value: "18",
      icon: <CheckCircle2 size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Pemakaian",
      value: "1,204",
      icon: <MousePointer2 size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Akan Berakhir",
      value: "3",
      icon: <Clock size={20} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B]">
            Promotion <span className="text-[#E65100]">Center</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">
            Kelola kode voucher dan kampanye diskon OKAI
          </p>
        </div>
        <button
          onClick={() => navigate("/promotions/create")}
          className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Buat Promo Baru
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {promoStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div
              className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {stat.label}
            </p>
            <h2 className="text-2xl font-black mt-1 text-slate-800">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* PROMOTIONS TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="font-black text-slate-800 text-lg">Active Vouchers</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari Kode Promo..."
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 outline-none w-48 font-medium"
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
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Kupon & Tipe
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Potongan
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Penggunaan
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Berakhir Pada
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {promotions.map((promo) => (
              <tr
                key={promo.id}
                className="hover:bg-orange-50/20 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 text-[#E65100] rounded-xl flex items-center justify-center font-bold">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 tracking-tight">
                        {promo.code}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {promo.type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg font-black text-xs">
                    {promo.value}
                  </span>
                </td>
                <td className="p-6 text-center">
                  <p className="font-bold text-slate-700">
                    {promo.used} / {promo.limit}
                  </p>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 mx-auto overflow-hidden">
                    <div
                      className="h-full bg-[#E65100] rounded-full"
                      style={{ width: `${(promo.used / promo.limit) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Calendar size={14} className="text-slate-300" />
                    {promo.expiry}
                  </div>
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      promo.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {promo.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => navigate(`/promotions/edit/${voucher.id}`)}
                      className="p-2 text-slate-400 hover:text-[#E65100] transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <Trash2 size={18} />
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
