import React, { useState, useEffect } from 'react';
import { KeyRound, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';
import { updateUser } from '../services/api'; // Menggunakan fungsi yang sudah ada

export default function ProfileSettings() {
  // 1. Mengambil data user yang sedang login dari LocalStorage
  const [adminData, setAdminData] = useState({});
  const [isAllowed, setIsAllowed] = useState(false);

  // 2. State untuk form data
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password_confirmation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Membaca data saat halaman pertama dimuat
    const storedData = JSON.parse(localStorage.getItem("okai_admin")) || {};
    setAdminData(storedData);
    
    // Mengecek Role (Hanya mengizinkan 'admin' biasa)
    const currentRole = storedData.role ? storedData.role.toLowerCase() : '';
    setIsAllowed(currentRole === 'admin');

    // Mengisi kolom nama dengan data saat ini
    setFormData(prev => ({ ...prev, name: storedData.name || '' }));
  }, []);

  // 3. Fungsi untuk menangani pembaruan data
  const handleSubmit = async () => {
    // Validasi Keamanan Lapis 1
    if (!isAllowed) {
      alert("Akses Ditolak: Fitur ubah profil ini hanya diperuntukkan bagi Admin Operasional.");
      return;
    }

    // Validasi Kesamaan Password
    if (formData.password && formData.password !== formData.password_confirmation) {
      alert("Validasi Gagal: Password Baru dan Ulangi Password tidak cocok!");
      return;
    }

    // Validasi Panjang Password (Jika diisi)
    if (formData.password && formData.password.length < 8) {
      alert("Validasi Gagal: Password minimal harus 8 karakter.");
      return;
    }

    setIsSubmitting(true);

    // Menyusun paket data (Hanya mengirim yang diisi)
    const payload = { name: formData.name };
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      // Mengirim ke server menggunakan ID user yang sedang login
      const response = await updateUser(adminData.id, payload);
      
      if (response.success) {
        alert("✅ Profil berhasil diperbarui!");
        
        // Memperbarui nama di LocalStorage agar sinkron dengan Navbar/Header
        const updatedData = { ...adminData, name: formData.name };
        localStorage.setItem("okai_admin", JSON.stringify(updatedData));
        
        // Mengosongkan kolom password setelah sukses
        setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
      } else {
        const errorMsg = response.message || JSON.stringify(response.errors);
        alert("❌ Gagal memperbarui profil: " + errorMsg);
      }
    } catch (error) {
      alert("Error Jaringan: Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black mb-2 text-[#1E293B]">Profile <span className="text-[#E65100]">Settings</span></h1>
        <p className="text-slate-400 text-sm mb-10 font-medium italic">Update informasi profil dan keamanan akun OKAI</p>

        {/* Peringatan Jika Role Bukan Admin */}
        {!isAllowed && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">Mode Baca Saja: Hanya role Admin yang diizinkan untuk mengubah data di halaman ini.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Informasi Profil */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
              <User size={18} className="text-[#E65100]" /> Data Diri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isAllowed || isSubmitting}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium disabled:opacity-50" 
                    placeholder="Masukkan nama lengkap Anda..." 
                  />
                </div>
              </div>
              
              {/* Kolom Email (Ditampilkan sebagai Info Saja - Read Only) */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email (Tidak dapat diubah)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="email" 
                    value={adminData.email || ''}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm outline-none font-medium text-slate-500 cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Keamanan */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
              <ShieldCheck size={18} className="text-[#E65100]" /> Ganti Password
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-medium italic">*Kosongkan jika tidak ingin mengubah password.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  disabled={!isAllowed || isSubmitting}
                  placeholder="Password Baru" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-50" 
                />
                <input 
                  type="password" 
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                  disabled={!isAllowed || isSubmitting}
                  placeholder="Ulangi Password" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none disabled:opacity-50" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button 
              onClick={handleSubmit}
              disabled={!isAllowed || isSubmitting}
              className="px-8 py-3 bg-[#E65100] text-white font-bold rounded-2xl shadow-lg shadow-orange-100 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Menyimpan...' : 'Update Profil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}