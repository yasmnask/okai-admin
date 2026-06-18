import React, { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Loader2, LayoutTemplate } from "lucide-react";

// Kita hanya meng-import API_URL dari service kamu, BUKAN axios
// Catatan: Jika getAuthHeaders tidak diexport di api.js, kita buatkan lokal di sini
const API_URL = "http://localhost:8000/api";

function getAuthHeaders(isFormData = false) {
  const adminData = JSON.parse(localStorage.getItem("okai_admin") || "{}");
  const token = adminData?.token;
  const headers = { "Accept": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  return headers;
}

export default function HomepageSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // State Form
  const [formData, setFormData] = useState({
    hero_badge: "",
    hero_title_1: "",
    hero_title_2: "",
    hero_highlight: "",
    hero_description: "",
    hero_button_text: "",
    hero_button_link: "",
    hero_product_title: "",
    hero_product_subtitle: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Ambil data saat ini saat halaman dimuat
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/homepage`, {
          method: "GET",
          headers: getAuthHeaders(false)
        });
        
        const responseData = await response.json();
        
        if (response.ok && responseData.success && responseData.data.settings) {
          const s = responseData.data.settings;
          setFormData({
            hero_badge: s.hero_badge || "",
            hero_title_1: s.hero_title_1 || "",
            hero_title_2: s.hero_title_2 || "",
            hero_highlight: s.hero_highlight || "",
            hero_description: s.hero_description || "",
            hero_button_text: s.hero_button_text || "",
            hero_button_link: s.hero_button_link || "",
            hero_product_title: s.hero_product_title || "",
            hero_product_subtitle: s.hero_product_subtitle || "",
          });
          if (s.hero_image_url) setPreviewImage(s.hero_image_url);
        }
      } catch (error) {
        console.error("Gagal mengambil pengaturan", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    
    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${API_URL}/homepage-settings`, {
        method: "POST",
        headers: getAuthHeaders(true), // true karena kita kirim form-data
        body: submitData
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        alert("Pembaruan berhasil! Silakan cek web e-commerce Anda.");
      } else {
        alert(responseData.message || "Gagal menyimpan perubahan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-orange-600" size={40}/></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl"><LayoutTemplate size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pengaturan Homepage</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ubah teks hero, deskripsi, dan gambar produk utama.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: TEKS HERO UTAMA */}
        <div className="bg-white dark:bg-[#1a1d1a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#2c2f2c]">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-[#2c2f2c] pb-2">1. Hero Teks & Deskripsi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Badge (Label Atas)</label>
              <input type="text" name="hero_badge" value={formData.hero_badge} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Baris Judul 1</label>
              <input type="text" name="hero_title_1" value={formData.hero_title_1} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" placeholder="Misal: Lebih Sehat," />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Baris Judul 2</label>
              <input type="text" name="hero_title_2" value={formData.hero_title_2} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" placeholder="Misal: Lebih Mudah" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Highlight (Teks Miring)</label>
              <input type="text" name="hero_highlight" value={formData.hero_highlight} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" placeholder="Misal: Dicerna." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Deskripsi Panjang</label>
              <textarea name="hero_description" value={formData.hero_description} onChange={handleInputChange} rows={3} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>

        {/* SECTION 2: TOMBOL & CTA */}
        <div className="bg-white dark:bg-[#1a1d1a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#2c2f2c]">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-[#2c2f2c] pb-2">2. Tombol Aksi (CTA)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Teks Tombol</label>
              <input type="text" name="hero_button_text" value={formData.hero_button_text} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" placeholder="Misal: Beli Sekarang" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Link Tujuan</label>
              <input type="text" name="hero_button_link" value={formData.hero_button_link} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" placeholder="Misal: /product/susu-kambing" />
            </div>
          </div>
        </div>

        {/* SECTION 3: GAMBAR & INFO PRODUK HERO */}
        <div className="bg-white dark:bg-[#1a1d1a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-[#2c2f2c]">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-[#2c2f2c] pb-2">3. Gambar Produk Melayang</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Upload Gambar</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-[#121212] transition relative h-48 flex items-center justify-center overflow-hidden">
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">Pilih Gambar</span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nama Produk Utama</label>
                <input type="text" name="hero_product_title" value={formData.hero_product_title} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Subtitle / Ukuran</label>
                <input type="text" name="hero_product_subtitle" value={formData.hero_product_subtitle} onChange={handleInputChange} className="w-full p-3 border border-slate-200 dark:border-[#2c2f2c] rounded-lg bg-slate-50 dark:bg-[#121212] dark:text-white outline-none focus:border-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* TOMBOL SUBMIT */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#E65100] text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 flex items-center gap-2 disabled:opacity-50 transition-all">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>

      </form>
    </div>
  );
}