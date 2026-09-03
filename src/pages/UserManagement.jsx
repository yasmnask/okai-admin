import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { getUsers, deleteUser } from "../services/api";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function UserManagement() {
  const navigate = useNavigate();

  // State untuk Filter (Yasmin)
  const [selectedRole, setSelectedRole] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State untuk Data dan Pencarian (Naufal)
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchUsers = async (query = "") => {
    try {
      setIsLoading(true);
      const result = await getUsers(query); // Kirim kata kunci ke api.js
      if (result && result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efek Pencarian (Debounce 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(searchKeyword);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const handleDelete = async (id, role) => {
    // Detektor Keamanan Frontend
    if (role === "Super Admin") {
      toast.error(
        "⚠️ Ditolak: Anda tidak diizinkan menghapus akun dengan hak akses tingkat tinggi."
      );
      return;
    }

    if (window.confirm("Yakin ingin menghapus pengguna ini secara permanen?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Proses Penyaringan Data (Filter Frontend)
  const filteredUsers = users.filter((user) => {
    const userDate = new Date(user.joined);

    if (selectedRole !== "All" && user.role !== selectedRole) {
      return false;
    }

    if (statusFilter !== "All" && user.status !== statusFilter) {
      return false;
    }

    if (dateFrom && userDate < new Date(dateFrom)) {
      return false;
    }

    if (dateTo && userDate > new Date(dateTo)) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen transition-colors">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-white transition-colors">
              User <span className="text-[#E65100]">Management</span>
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic transition-colors">
              Kelola hak akses dan peran pengguna OKAI
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/users/create")}
          className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 dark:shadow-black/50 hover:scale-105 transition-transform"
        >
          <UserPlus size={20} /> Tambah User Baru
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white dark:bg-[#1a1d1a] p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row gap-4 mb-8 transition-colors">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchKeyword}                                
            onChange={(e) => setSearchKeyword(e.target.value)}   
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* ROLE FILTER */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold border border-slate-100 dark:border-transparent outline-none transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold border border-slate-100 dark:border-transparent outline-none transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Active">Verified</option>
            <option value="Inactive">Unverified</option>
          </select>

          {/* DATE RANGE FILTER */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-bold border border-slate-100 dark:border-transparent transition-colors"
            >
              <Calendar size={16} />
              Pilih Tanggal
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-[#1a1d1a] p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800/50 z-10 flex items-center gap-2 transition-colors">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white rounded-xl text-sm border border-slate-100 dark:border-transparent outline-none transition-colors color-scheme-dark"
                  style={{ colorScheme: 'light dark' }}
                />
                <span className="text-slate-400 dark:text-slate-500 text-sm">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white rounded-xl text-sm border border-slate-100 dark:border-transparent outline-none transition-colors"
                  style={{ colorScheme: 'light dark' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800/50 overflow-hidden transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#2a2d2a]/50 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                User Info
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Role
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Join Date
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Status
              </th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-20 text-center text-slate-400 dark:text-slate-600 font-bold animate-pulse"
                >
                  Mengambil data pengguna...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-20 text-center text-slate-400 dark:text-slate-600 font-bold italic"
                >
                  Belum ada pengguna yang terdaftar atau cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              // 👇 INI ADALAH TITIK PENYELESAIAN KONFLIKNYA 👇
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-orange-50/20 dark:hover:bg-[#3e3c3a]/20 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[#E65100] font-black uppercase transition-colors">
                        {user.name ? user.name.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm transition-colors">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 transition-colors">
                          <Mail size={12} /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-blue-500 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">
                      <Calendar size={14} />
                      {user.joined}
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1 transition-colors ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
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
                      <button
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        className="p-2 text-slate-400 hover:text-[#E65100] dark:hover:text-[#E65100] hover:bg-white dark:hover:bg-[#2a2d2a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.role)}
                        className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-[#2a2d2a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <Trash2 size={18} />
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
  );
}