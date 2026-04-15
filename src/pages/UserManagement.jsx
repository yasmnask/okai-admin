import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const [selectedRole, setSelectedRole] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await getUsers();
      if (result && result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, role) => {
    if (role === "Super Admin" || role === "Affiliate") {
      alert(
        "⚠️ Ditolak: Anda tidak diizinkan menghapus akun dengan hak akses tingkat tinggi.",
      );
      return;
    }

    if (window.confirm("Yakin ingin menghapus pengguna ini secara permanen?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert(error.message);
      }
    }
  };

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
          onClick={() => navigate("/users/create")}
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
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* ROLE */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-100 outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Affiliate">Affiliate</option>
            <option value="Super Admin">Super Admin</option>
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-100 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Verified</option>
            <option value="Inactive">Unverified</option>
          </select>

          {/* DATE RANGE (UPDATED) */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-100"
            >
              <Calendar size={16} />
              Pilih Tanggal
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-10 flex items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 bg-slate-50 rounded-xl text-sm border border-slate-100 outline-none"
                />
                <span className="text-slate-400 text-sm">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 bg-slate-50 rounded-xl text-sm border border-slate-100 outline-none"
                />
              </div>
            )}
          </div>
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
            {isLoading ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-20 text-center text-slate-400 font-bold animate-pulse"
                >
                  Mengambil data pengguna...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-20 text-center text-slate-400 font-bold italic"
                >
                  Belum ada pengguna yang terdaftar.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-orange-50/20 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#E65100] font-black uppercase">
                        {user.name ? user.name.charAt(0) : "?"}
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
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
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
                      <button
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.role)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"
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
