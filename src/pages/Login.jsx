import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";
import { toast } from "react-hot-toast";
import { Loader2, Lock, Mail, Box } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Jika user sudah login, langsung tendang ke dashboard biar gak perlu login lagi
  useEffect(() => {
    const adminData = localStorage.getItem("okai_admin");
    if (adminData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const response = await loginAdmin(formData);
      
      // 👇 PERBAIKAN STRUKTUR DATA 👇
      let dataToSave = response.data ? response.data : response; 
      
      // Jika role sembunyi di dalam object 'user', kita lebur/gabungkan agar mudah dibaca App.jsx
      if (dataToSave.user) {
        dataToSave = { ...dataToSave, ...dataToSave.user };
      }
      
      localStorage.setItem("okai_admin", JSON.stringify(dataToSave));
      
      toast.success("Login berhasil! Selamat datang kembali.");
      
      // Arahkan berdasarkan role
      const role = dataToSave?.role?.toLowerCase();
      if (role === "affiliate") {
        navigate("/affiliate");
      } else {
        navigate("/dashboard");
      }
      
    } catch (error) {
      toast.error(error.message || "Login gagal. Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4 font-sans selection:bg-[#E65100] selection:text-white transition-colors duration-300">
      
      {/* Container Utama */}
      <div className="w-full max-w-md bg-white dark:bg-[#1a1d1a] rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-[#2c2f2c] p-8 md:p-10 relative overflow-hidden">
        
        {/* Dekorasi Latar Belakang (Subtle Muted Blur) */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo & Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E65100] text-white rounded-2xl shadow-lg shadow-orange-500/30 mb-6">
            <Box size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Please enter your admin credentials to continue.
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Input Email */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@okai.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2c2f2c] rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#E65100] focus:ring-1 focus:ring-[#E65100] transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              {/* Fitur Forgot Password (Opsional/Bisa dihilangkan jika belum ada halamannya) */}
              <a href="#" className="text-xs font-bold text-[#E65100] hover:text-orange-700 transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#2c2f2c] rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#E65100] focus:ring-1 focus:ring-[#E65100] transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#E65100] text-white rounded-xl font-bold tracking-wide hover:bg-[#CC4800] hover:shadow-lg hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65100] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Authenticating...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}