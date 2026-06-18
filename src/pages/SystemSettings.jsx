import React, { useState, useEffect } from 'react';
import { Settings, Globe, Key, Power, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSystemSettings, updateSystemSettings } from '../services/api';

export default function SystemSettings() {
  const adminData = JSON.parse(localStorage.getItem("okai_admin") || "{}");
  const isSuperAdmin = adminData?.email === "admin@gmail.com";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_logo: "",
    maintenance_mode: false,
    biteship_api_key: "",
    xendit_api_key: "",
    binderbyte_api_key: "",
    google_client_id: "",
    google_client_secret: "",
    google_redirect_uri: ""
  });

  useEffect(() => {
    if (!isSuperAdmin) return;
    
    const fetchSettings = async () => {
      try {
        const res = await getSystemSettings();
        if (res.success && res.data) {
          setFormData({
            brand_name: res.data.brand_name || "",
            brand_logo: res.data.brand_logo || "",
            maintenance_mode: res.data.maintenance_mode || false,
            biteship_api_key: res.data.biteship_api_key || "",
            xendit_api_key: res.data.xendit_api_key || "",
            binderbyte_api_key: res.data.binderbyte_api_key || "",
            google_client_id: res.data.google_client_id || "",
            google_client_secret: res.data.google_client_secret || "",
            google_redirect_uri: res.data.google_redirect_uri || ""
          });
        }
      } catch (err) {
        toast.error("Gagal mengambil pengaturan sistem.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#1a1e1a]">
        <div className="bg-red-50 text-red-500 font-bold p-8 rounded-3xl border border-red-100 text-center max-w-md">
          <Power size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl mb-2">Akses Ditolak</h2>
          <p className="text-sm font-medium">Halaman ini adalah Area Berbahaya. Hanya Super Admin Utama (admin@gmail.com) yang diizinkan untuk mengakses dan mengubah pengaturan inti sistem.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateSystemSettings(formData);
      if (res.success) {
        toast.success(res.message || "Pengaturan berhasil disimpan!");
      } else {
        toast.error(res.message || "Gagal menyimpan pengaturan.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menyimpan pengaturan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#1a1e1a]">
        <Loader2 className="animate-spin text-[#E65100]" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans transition-colors pb-24">
      <h1 className="text-2xl font-black mb-2 text-[#1E293B] dark:text-white transition-colors">
        System <span className="text-[#E65100]">Settings</span>
      </h1>
      <p className="text-slate-400 dark:text-slate-500 text-sm mb-10 font-medium italic transition-colors">
        Konfigurasi global platform e-commerce, API pihak ketiga, dan mode perawatan.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* 1. General Configuration */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-6 border-b pb-4 border-slate-50 dark:border-slate-800/50 transition-colors">
            <Globe size={18} className="text-[#E65100]" /> General Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">
                Nama Brand / Situs
              </label>
              <input 
                type="text" 
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors" 
                placeholder="Okai Store" 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">
                URL Logo Utama (Link Gambar)
              </label>
              <input 
                type="text" 
                name="brand_logo"
                value={formData.brand_logo}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors" 
                placeholder="https://domain.com/logo.png" 
              />
            </div>
          </div>
        </div>

        {/* 2. API Keys Management */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors flex flex-col gap-4">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-2 border-b pb-4 border-slate-50 dark:border-slate-800/50 transition-colors">
            <Key size={18} className="text-[#E65100]" /> Secret API Keys Management
          </h3>
          
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">Xendit Secret Key (Payment)</label>
            <input type="text" name="xendit_api_key" value={formData.xendit_api_key} onChange={handleChange} placeholder="xnd_development_..." className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">Biteship API Key (Shipping / Rates)</label>
            <input type="text" name="biteship_api_key" value={formData.biteship_api_key} onChange={handleChange} placeholder="biteship_test_..." className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">Binderbyte API Key (Tracking)</label>
            <input type="text" name="binderbyte_api_key" value={formData.binderbyte_api_key} onChange={handleChange} placeholder="binderbyte_api_..." className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none" />
          </div>
        </div>

        {/* 3. Google OAuth Settings */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-colors flex flex-col gap-4 xl:col-span-2">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white mb-2 border-b pb-4 border-slate-50 dark:border-slate-800/50 transition-colors">
            <Globe size={18} className="text-[#E65100]" /> Google OAuth / SSO
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">Google Client ID</label>
              <input type="text" name="google_client_id" value={formData.google_client_id} onChange={handleChange} placeholder="...apps.googleusercontent.com" className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">Google Client Secret</label>
              <input type="text" name="google_client_secret" value={formData.google_client_secret} onChange={handleChange} placeholder="GOCSPX-..." className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 transition-colors">Google Redirect URI (Callback)</label>
            <input type="text" name="google_redirect_uri" value={formData.google_redirect_uri} onChange={handleChange} placeholder="http://localhost:8000/auth/google/callback" className="w-full px-5 py-3 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm outline-none" />
          </div>
        </div>

        {/* 4. Maintenance Mode Toggle */}
        <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm xl:col-span-2 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center shrink-0 transition-colors">
                <Power size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white transition-colors">
                  Maintenance Mode
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic transition-colors">
                  Matikan akses publik saat sedang melakukan perbaikan sistem atau migrasi database. Super Admin tetap bisa mengakses.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-16 sm:ml-0">
              <input type="checkbox" name="maintenance_mode" checked={formData.maintenance_mode} onChange={handleChange} className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500 dark:peer-checked:bg-red-600 transition-colors"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button disabled={isSaving} onClick={handleSave} className="flex items-center gap-2 px-10 py-4 bg-[#E65100] text-white font-black rounded-3xl shadow-xl shadow-orange-100 dark:shadow-black/50 hover:scale-105 transition-all disabled:opacity-50">
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          {isSaving ? "Menyimpan..." : "Simpan Konfigurasi"}
        </button>
      </div>
    </div>
  );
}