import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowLeft,
  Edit3,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
  MoreVertical,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function UserManagement() {
  const navigate = useNavigate();

  // Mock Data User - Siap dihubungkan ke API Resource Laravel
  const [users] = useState([
    {
      id: 1,
      name: "Muhammad Fawwas",
      email: "fawwas@otakkanan.co.id",
      role: "Super Admin",
      status: "Active",
      joined: "12 Jan 2026",
    },
    {
      id: 2,
      name: "Dhandi Ramadhan",
      email: "dhandi@affiliate.com",
      role: "Affiliate",
      status: "Active",
      joined: "05 Feb 2026",
    },
    {
      id: 3,
      name: "Customer A",
      email: "customer@gmail.com",
      role: "Customer",
      status: "Inactive",
      joined: "01 Mar 2026",
    },
  ]);

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E293B]">
              User <span className="text-[#E65100]">Management</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium italic">
              Kelola hak akses dan peran pengguna OKAI
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/users/create")} // Navigasi ke halaman form
          className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:scale-105 transition-transform"
        >
          <UserPlus size={20} /> Tambah User Baru
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-100">
            <Filter size={18} /> Role: All
          </button>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                User Info
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Role
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Join Date
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-orange-50/20 transition-colors group"
              >
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#E65100] font-black uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-blue-500" />
                    <span className="text-sm font-semibold text-slate-600">
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={14} />
                    {user.joined}
                  </div>
                </td>
                <td className="p-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1 ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status === "Active" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {user.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm">
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
