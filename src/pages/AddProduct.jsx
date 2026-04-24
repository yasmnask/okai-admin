import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Image as ImageIcon, Box, 
  Info, Settings, Barcode, Layers, MapPin, 
  UploadCloud, X, Grid, CheckCircle2
} from 'lucide-react';
import { addProduct } from '../services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // LOGIKA AUTO-GENERATE SKU KAMBI
  const generateSKU = (categoryName) => {
    const prefixMap = {
      'Bubuk Premium': 'BP',
      'Herbal Spesial': 'HS',
      'Paket Keluarga': 'PK',
      'Perawatan Tubuh': 'PT',
      'Merchandise': 'MD'
    };
    const prefix = prefixMap[categoryName] || 'XX';
    const randomNum = Math.floor(1000 + Math.random() * 9000); 
    return `KMB-${prefix}-${randomNum}`;
  };

  // State Produk
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bubuk Premium', 
    sku: generateSKU('Bubuk Premium'), 
    warehouse: 'Gudang Utama (Surabaya)',
    description: '',
    price: '',
    stock: 0,
    image_url: '',    // URL gambar (dari galeri atau preview upload baru)
    image_file: null, // File fisik (HANYA JIKA upload baru)
    is_active: 1
  });

  // ==========================================
  // STATE & LOGIKA MEDIA LIBRARY (GALERI)
  // ==========================================
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState('gallery'); // 'gallery' atau 'upload'
  
  // Dummy Data Galeri (Nanti di-fetch dari API backend)
  const [galleryImages] = useState([
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=300&auto=format&fit=crop', // Contoh Susu
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=300&auto=format&fit=crop', // Contoh Botol
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300&auto=format&fit=crop', // Contoh Bubuk
    'https://images.unsplash.com/photo-1606214174585-fd10f6d8118d?q=80&w=300&auto=format&fit=crop', // Contoh Cup
  ]);
  
  const [selectedGalleryImg, setSelectedGalleryImg] = useState('');

  // Handle Pilih dari Galeri
  const handleSelectFromGallery = () => {
    if (selectedGalleryImg) {
      setFormData({
        ...formData,
        image_url: selectedGalleryImg,
        image_file: null // Kosongkan file karena kita pakai gambar yang sudah ada di server
      });
      setIsMediaOpen(false);
    }
  };

  // Handle Upload File Baru
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image_file: file,     
        image_url: previewUrl 
      });
      setIsMediaOpen(false);
    }
  };

  // ==========================================

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setFormData({ ...formData, category: newCategory, sku: generateSKU(newCategory) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Siapkan FormData
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('sku', formData.sku);
    payload.append('category', formData.category);
    payload.append('warehouse', formData.warehouse);
    payload.append('description', formData.description);
    payload.append('price', parseFloat(formData.price) || 0);
    payload.append('stock', parseInt(formData.stock) || 0);
    payload.append('is_active', formData.is_active ? 1 : 0);
    
    // LOGIKA PENGIRIMAN GAMBAR KE BACKEND:
    if (formData.image_file) {
      // 1. Kalau upload baru, kirim filenya
      payload.append('image_file', formData.image_file); 
    } else if (formData.image_url) {
      // 2. Kalau pilih dari galeri, kirim URL-nya aja
      payload.append('image_url', formData.image_url);
    }

    try {
      const response = await addProduct(payload);
      if(response.success || response.id) {
        navigate('/product');
      } else {
        alert("Gagal simpan: " + JSON.stringify(response.errors));
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans relative">
      
      {/* --- MEDIA LIBRARY MODAL --- */}
      {isMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <ImageIcon className="text-[#E65100]" /> Media Library
              </h2>
              <button onClick={() => setIsMediaOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-8 px-8 pt-4 border-b border-slate-100">
              <button 
                onClick={() => setMediaTab('gallery')}
                className={`pb-4 text-sm font-black uppercase tracking-widest border-b-2 transition-all ${mediaTab === 'gallery' ? 'border-[#E65100] text-[#E65100]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <span className="flex items-center gap-2"><Grid size={16} /> Galeri KAMBI</span>
              </button>
              <button 
                onClick={() => setMediaTab('upload')}
                className={`pb-4 text-sm font-black uppercase tracking-widest border-b-2 transition-all ${mediaTab === 'upload' ? 'border-[#E65100] text-[#E65100]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <span className="flex items-center gap-2"><UploadCloud size={16} /> Upload Baru</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              {mediaTab === 'gallery' ? (
                // TAB 1: GALERI
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedGalleryImg(img)}
                      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedGalleryImg === img ? 'border-[#E65100] shadow-lg shadow-orange-500/30 scale-95' : 'border-transparent hover:border-slate-200'}`}
                    >
                      <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                      {selectedGalleryImg === img && (
                        <div className="absolute top-2 right-2 bg-[#E65100] text-white rounded-full">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // TAB 2: UPLOAD BARU
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white relative hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                  <UploadCloud size={60} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-black text-slate-700 mb-2">Tarik dan Lepas gambar di sini</h3>
                  <p className="text-sm font-medium text-slate-400 mb-6">atau klik tombol di bawah (Max 2MB)</p>
                  <label className="px-8 py-3 bg-[#1E293B] text-white rounded-xl font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-slate-900/20">
                    Pilih File Gambar
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer (Cuma muncul di tab Galeri) */}
            {mediaTab === 'gallery' && (
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                <button onClick={() => setIsMediaOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Batal</button>
                <button 
                  onClick={handleSelectFromGallery}
                  disabled={!selectedGalleryImg}
                  className="px-8 py-3 bg-[#E65100] text-white font-black uppercase tracking-widest text-xs rounded-xl disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  Gunakan Gambar Ini
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- END MEDIA LIBRARY MODAL --- */}


      {/* STICKY HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/product')} className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all">
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Box size={12} /> KAMBI Premium
            </div>
            <h1 className="text-2xl font-black text-[#1E293B]">Publish <span className="text-[#E65100]">New Product</span></h1>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => navigate('/product')} className="flex-1 md:flex-none px-6 py-3.5 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-10 py-3.5 bg-[#E65100] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Processing..." : <><Save size={18} /> Simpan Produk</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* KIRI: DETAIL KONTEN */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
              <Info size={16} className="text-[#E65100]" /> Informasi Utama
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nama Produk</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm outline-none focus:border-orange-100 focus:bg-white transition-all font-bold" 
                    placeholder="Contoh: KAMBI Susu Kambing Original 500gr" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">SKU Code (Auto)</label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                    <input 
                      type="text" 
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full pl-11 pr-4 py-4 bg-orange-50 border-none text-orange-700 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-orange-500/20" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Deskripsi Produk</label>
                <textarea 
                  rows="8" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-orange-100 focus:bg-white transition-all font-medium leading-relaxed" 
                  placeholder="Ceritakan keunggulan susu KAMBI ini..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* KANAN: METADATA & SETTINGS */}
        <div className="xl:col-span-4 space-y-6">
          {/* HARGA & STOK */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings size={16} className="text-[#E65100]" /> Inventory
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Harga Jual</label>
                <div className="flex items-center gap-2 text-lg font-black">
                  <span className="text-slate-300">Rp</span>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="bg-transparent w-full outline-none" />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Stok Tersedia</label>
                <div className="flex items-center gap-2 text-lg font-black text-orange-600">
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="bg-transparent w-full outline-none" />
                  <span className="text-[10px] text-slate-300 uppercase">Unit/Box</span>
                </div>
              </div>
            </div>
          </div>

          {/* KLASIFIKASI */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Layers size={12} /> Kategori KAMBI
                </label>
                <select 
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer text-slate-700"
                >
                  <option value="Bubuk Premium">Bubuk Premium</option>
                  <option value="Herbal Spesial">Herbal Spesial</option>
                  <option value="Paket Keluarga">Paket Keluarga</option>
                  <option value="Perawatan Tubuh">Perawatan Tubuh</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <MapPin size={12} /> Warehouse Location
                </label>
                <select 
                  value={formData.warehouse}
                  onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer text-slate-700"
                >
                  <option value="Gudang Utama (Surabaya)">Gudang Utama (Surabaya)</option>
                  <option value="Gudang Jakarta">Gudang Jakarta</option>
                  <option value="Gudang Sidoarjo">Gudang Sidoarjo</option>
                </select>
              </div>
            </div>
          </div>

          {/* STATUS TOGGLE */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</p>
              <p className="text-xs font-bold text-slate-700">{formData.is_active ? 'Terbitkan Produk' : 'Simpan Draft'}</p>
            </div>
            <button 
              onClick={() => setFormData({...formData, is_active: formData.is_active ? 0 : 1})}
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.is_active ? 'bg-green-500' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* TOMBOL BUKA MEDIA LIBRARY */}
          <div className="bg-[#1E293B] p-8 rounded-[3rem] shadow-2xl text-white relative">
            <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <ImageIcon size={14} className="text-[#E65100]" /> Product Image
            </h3>
            <div className="space-y-4">
              <div 
                onClick={() => setIsMediaOpen(true)}
                className="w-full aspect-square bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-orange-500/50 transition-colors"
              >
                {/* Gambar Preview */}
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <Grid size={32} className="mx-auto mb-2 text-white" />
                    <p className="text-[10px] font-black uppercase tracking-widest mt-3">Buka Media Library</p>
                  </div>
                )}

                {/* Overlay ganti foto kalau udah ada gambar */}
                {formData.image_url && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest bg-[#E65100] px-4 py-2 rounded-full">Ganti Foto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* END UPLOAD IMAGE */}

        </div>
      </div>
    </div>
  );
}