import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Mail,
  ShieldCheck,
  Lock,
  User,
  Info,
  Loader2,
} from "lucide-react";
import { getUserById, updateUser } from "../services/api";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    password: "", // Password sengaja dikosongkan untuk alasan keamanan
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await getUserById(id);

        if (response.success) {
          const userData = response.data;

          // Detektor Keamanan: Lempar kembali jika role tidak diizinkan diedit
          if (userData.role === "superadmin") {
            alert(
              "Akses Ditolak: Anda tidak memiliki izin untuk mengedit profil Super Admin.",
            );
            navigate("/users");
            return;
          }

          setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role || "customer",
            password: "", // Tetap kosongkan
          });
        } else {
          alert("Pengguna tidak ditemukan!");
          navigate("/users");
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Hanya kirim password jika form tidak kosong
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      const response = await updateUser(id, payload);
      if (response.success) {
        navigate("/users");
      } else {
        alert(
          "Gagal menyimpan: " +
            JSON.stringify(response.errors || "Periksa kembali data Anda"),
        );
      }
    } catch (error) {
      alert("Error: Terjadi masalah koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <Loader2 className="animate-spin text-[#E65100]" size={40} />
        <p className="text-slate-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">
          Menarik Data Pengguna...
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/users")}
            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <ShieldCheck size={12} /> ID Pengguna: {id}
            </div>
            <h1 className="text-2xl font-black text-[#1E293B]">
              Edit <span className="text-[#E65100]">User</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/users")}
            className="flex-1 md:flex-none px-6 py-3.5 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-10 py-3.5 bg-[#1E293B] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Menyimpan..."
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-10">
            <Info size={16} className="text-[#E65100]" /> Profil Akun
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* NAMA LENGKAP */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Hak Akses (Role)
                </label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer"
                  >
                    <option value="customer">Customer / Pembeli</option>
                    <option value="affiliate">Affiliate / Partner</option>
                    <option value="admin">Admin Operasional</option>
                  </select>
                </div>
              </div>

              {/* PASSWORD (OPTIONAL) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                  <span>Kata Sandi Baru</span>
                  <span className="text-orange-400 italic font-medium">
                    (Opsional)
                  </span>
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Kosongkan jika tidak diubah"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4 items-start mt-6">
              <div className="p-2 bg-white rounded-xl text-slate-500 shadow-sm">
                <Info size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-700 uppercase tracking-tight mb-1">
                  Informasi Pembaruan
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Pastikan alamat email yang dimasukkan valid dan belum
                  digunakan oleh pengguna lain. Jika kolom kata sandi
                  dikosongkan, kata sandi lama akan tetap dipertahankan.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
