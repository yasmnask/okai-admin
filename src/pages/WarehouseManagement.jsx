import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { Plus, Search, Edit3, Trash2, MapPin, Eye } from "lucide-react";
import { getWarehouses, deleteWarehouse, addWarehouse, updateWarehouse, getUsers } from "../services/api";

export default function WarehouseManagement() {
  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));
  const userRole = adminData?.role?.toLowerCase();
  const [warehouses, setWarehouses] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWarehouseId, setCurrentWarehouseId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    user_id: ""
  });

  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      const result = await getWarehouses();
      if (result && result.success) {
        setWarehouses(result.data);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await getUsers();
      if (res && res.success) {
        // Filter user yang memiliki role 'admin' (case-insensitive)
        setAdminUsers(res.data.filter(u => u.role?.toLowerCase() === 'admin'));
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchAdmins();
  }, []);

  const handleOpenModal = (warehouse = null) => {
    if (warehouse) {
      setIsEditing(true);
      setCurrentWarehouseId(warehouse.id_warehouse);
      setFormData({
        name: warehouse.name,
        address: warehouse.address || "",
        city: warehouse.city || "",
        province: warehouse.province || "",
        postal_code: warehouse.postal_code || "",
        user_id: warehouse.user_id || ""
      });
    } else {
      setIsEditing(false);
      setCurrentWarehouseId(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        user_id: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      user_id: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateWarehouse(currentWarehouseId, formData);
        toast.success("Gudang berhasil diperbarui!");
      } else {
        await addWarehouse(formData);
        toast.success("Gudang berhasil ditambahkan!");
      }
      handleCloseModal();
      fetchWarehouses();
    } catch (error) {
      toast.error("Gagal menyimpan data gudang.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus gudang ini?")) {
      try {
        await deleteWarehouse(id);
        toast.success("Gudang berhasil dihapus!");
        fetchWarehouses();
      } catch (error) {
        toast.error("Gagal menghapus gudang.");
      }
    }
  };

  const filteredWarehouses = warehouses.filter((w) =>
    w.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    (w.city && w.city.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-[#1E293B] dark:text-white">
            Warehouse <span className="text-[#E65100]">Management</span>
          </h1>
          <p className="text-slate-400 dark:text-[#e1d4cc] text-sm font-medium">
            Kelola data gudang dan stok produk di setiap lokasi.
          </p>
        </div>
        {userRole !== "admin" && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#E65100] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 dark:shadow-black hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Tambah Gudang Baru
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#3e3c3a] p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-0 dark:shadow-black flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama gudang atau kota..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#1a1d1a] dark:text-slate-300 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1d1a] rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-0 dark:shadow-md dark:shadow-black overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#3e3c3a] border-b border-slate-100 dark:border-black">
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Nama Gudang</th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Alamat</th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">Admin Pengelola</th>
              <th className="p-6 text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-black">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-400 dark:text-slate-600 font-bold animate-pulse">
                  Mengambil data gudang dari server...
                </td>
              </tr>
            ) : filteredWarehouses.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-400 dark:text-slate-300/30 font-bold italic">
                  Belum ada data gudang terdaftar.
                </td>
              </tr>
            ) : (
              filteredWarehouses.map((warehouse) => (
                <tr key={warehouse.id_warehouse} className="hover:bg-orange-50/30 dark:hover:bg-[#3e3c3a]/20 transition-colors group">
                  <td className="p-6">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{warehouse.name}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{warehouse.city || "-"}, {warehouse.province || "-"}</p>
                    <p className="text-xs text-slate-400">{warehouse.address || "Alamat belum diatur"}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#E65100] font-bold text-xs">
                            {warehouse.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{warehouse.user?.name || "Belum Ada"}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{warehouse.user?.email || "Manager tidak diset"}</p>
                        </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => navigate(`/warehouse/${warehouse.id_warehouse}`)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700" title="Kelola Stok">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenModal(warehouse)} className="p-2 text-slate-400 hover:text-[#E65100] hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <Edit3 size={18} />
                      </button>
                      {userRole !== "admin" && (
                        <button onClick={() => handleDelete(warehouse.id_warehouse)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-[#3e3c3a] rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM GUDANG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1d1a] w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border dark:border-slate-800/50">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/50">
              <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <MapPin className="text-[#E65100]" /> {isEditing ? "Edit Gudang" : "Tambah Gudang Baru"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Nama Gudang</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Alamat</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Kota</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Provinsi</label>
                  <input type="text" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Kode Pos</label>
                <input type="text" value={formData.postal_code} onChange={(e) => setFormData({...formData, postal_code: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Admin Pengelola (Opsional)</label>
                <select disabled={userRole === 'admin'} value={formData.user_id} onChange={(e) => setFormData({...formData, user_id: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="">-- Tidak Ada --</option>
                  {adminUsers
                    .filter(admin => {
                      // Check if this admin is already assigned to another warehouse
                      const isAssignedToOther = warehouses.some(w => w.user_id === admin.id && w.id_warehouse !== currentWarehouseId);
                      return !isAssignedToOther;
                    })
                    .map(admin => (
                      <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>
                    ))
                  }
                </select>
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/50">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2.5 bg-[#E65100] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
