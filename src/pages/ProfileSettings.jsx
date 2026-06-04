import React, { useState, useEffect } from "react";
import { KeyRound, Mail, User, ShieldCheck, AlertCircle, Moon, Sun } from "lucide-react";
import toast from 'react-hot-toast';
import { updateUser } from "../services/api";

export default function ProfileSettings() {
  const [adminData, setAdminData] = useState({});
  const [isAllowed, setIsAllowed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State khusus untuk Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("okai_admin")) || {};
    setAdminData(storedData);

    const currentRole = storedData.role ? storedData.role.toLowerCase() : "";
    setIsAllowed(currentRole === "admin" || currentRole === "superadmin"); // Tambahin superadmin kalau butuh

    // Fetch detail terbaru dari backend untuk memastikan dapat phone_number
    if (storedData.id) {
      fetch(`http://localhost:8000/api/users/${storedData.id}`, {
        headers: {
          'Authorization': `Bearer ${storedData.token}`
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setFormData(prev => ({ 
            ...prev, 
            name: result.data.name || "",
            phone_number: result.data.phone_number || ""
          }));
        }
      })
      .catch(err => {
         setFormData(prev => ({ ...prev, name: storedData.name || "" }));
      });
    }

    // Cek status tema di LocalStorage pas halaman dibuka (Solusi bug refresh)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || document.documentElement.classList.contains("dark")) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fungsi Toggle Theme
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleSubmit = async () => {
    if (!isAllowed) {
      toast.error("Akses Ditolak: Fitur ubah profil ini hanya diperuntukkan bagi Admin Operasional.");
      return;
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error("Validasi Gagal: Password Baru dan Ulangi Password tidak cocok!");
      return;
    }

    if (formData.password && formData.password.length < 8) {
      toast.error("Validasi Gagal: Password minimal harus 8 karakter.");
      return;
    }

    setIsSubmitting(true);

    const payload = { 
      name: formData.name,
      phone_number: formData.phone_number
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      const response = await updateUser(adminData.id, payload);

      if (response.success) {
        toast.success("✅ Profil berhasil diperbarui!");
        const updatedData = { ...adminData, name: formData.name, phone_number: formData.phone_number };
        localStorage.setItem("okai_admin", JSON.stringify(updatedData));

        setFormData((prev) => ({
          ...prev,
          password: "",
          password_confirmation: "",
        }));
      } else {
        const errorMsg = response.message || JSON.stringify(response.errors);
        toast.error("❌ Gagal memperbarui profil: " + errorMsg);
      }
    } catch (error) {
      toast.error("Error Jaringan: Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen transition-colors">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black mb-2 text-[#1E293B] dark:text-white transition-colors">
          Profile <span className="text-[#E65100]">Settings</span>
        </h1>
        <p className="text-slate-400 dark:text-[#e1d4cc] text-sm mb-10 font-medium italic transition-colors">
          Update informasi profil dan keamanan akun OKAI
        </p>

        {!isAllowed && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">
              Mode Baca Saja: Hanya role Admin yang diizinkan untuk mengubah data di halaman ini.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* TEMA APLIKASI (DARK MODE TOGGLE) */}
          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 dark:bg-[#3e3c3a] rounded-2xl text-[#E65100] transition-colors">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 transition-colors">
                  Tema Aplikasi
                </h3>
                <p className="text-xs text-slate-400 dark:text-[#e1d4cc] font-medium transition-colors">
                  {isDarkMode ? "Mode Gelap sedang aktif" : "Mode Terang sedang aktif"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${isDarkMode ? "bg-[#E65100]" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
          </div>

          {/* INFORMASI PROFIL */}
          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-xl shadow-sm transition-colors">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-6 transition-colors">
              <User size={18} className="text-[#E65100]" /> Data Diri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-[#e1d4cc] uppercase tracking-widest mb-2 ml-1 transition-colors">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-100" size={16} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isAllowed || isSubmitting}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#3e3c3a] border-none rounded-2xl text-slate-500 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-[#E65100] outline-none font-medium disabled:opacity-50 transition-colors"
                    placeholder="Masukkan nama lengkap Anda..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-[#e1d4cc] uppercase tracking-widest mb-2 ml-1 transition-colors">
                  Nomor Telepon (Wajib untuk Kurir)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    disabled={!isAllowed || isSubmitting}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#3e3c3a] border-none rounded-2xl text-slate-500 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-[#E65100] outline-none font-medium disabled:opacity-50 transition-colors"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-[#e1d4cc] uppercase tracking-widest mb-2 ml-1 transition-colors">
                  Email (Tidak dapat diubah)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-100" size={16} />
                  <input
                    type="email"
                    value={adminData.email || ""}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-[#3e3c3a]/50 border-none rounded-2xl text-sm outline-none font-medium text-slate-500 dark:text-slate-300 cursor-not-allowed transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KEAMANAN */}
          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-0 dark:shadow-black dark:shadow-xl shadow-sm transition-colors">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-6 transition-colors">
              <ShieldCheck size={18} className="text-[#E65100]" /> Ganti Password
            </h3>
            <p className="text-xs text-slate-400 dark:text-[#e1d4cc] mb-4 font-medium italic transition-colors">
              *Kosongkan jika tidak ingin mengubah password.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={!isAllowed || isSubmitting}
                  placeholder="Password Baru"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#3e3c3a] border-none rounded-2xl text-slate-500 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-[#E65100] outline-none disabled:opacity-50 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setFormData({ ...formData, password_confirmation: e.target.value })
                  }
                  disabled={!isAllowed || isSubmitting}
                  placeholder="Ulangi Password"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#3e3c3a] border-none rounded-2xl text-slate-500 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-[#E65100] outline-none disabled:opacity-50 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* TOMBOL SIMPAN */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={!isAllowed || isSubmitting}
              className="px-8 py-3 bg-[#E65100] text-white font-bold rounded-2xl shadow-lg shadow-orange-100 dark:shadow-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Menyimpan..." : "Update Profil"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}