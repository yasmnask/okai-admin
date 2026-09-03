import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Box,
  Info,
  Settings,
  Barcode,
  Layers,
  Loader2,
  X, 
  Grid, 
  UploadCloud, 
  CheckCircle2
} from "lucide-react";
import { getProductById, updateProduct } from "../services/api";
import { formatPrice, formatNumber, parseNumber } from '../utils/numberFormat';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Bubuk Premium",
    description: "",
    price: "",
    image_url: "",
    image_file: null, // Tambahan untuk file fisik
    is_active: 1,
    is_affiliate_enabled: 0,
    commission_type: 'percent', // 👈 Tipe baru
    commission_value: 15,       // 👈 Nilai baru
    // Dimensions for Biteship
    weight: 1000,
    length: 10,
    width: 10,
    height: 10,
    // Dropship settings
    is_dropship_enabled: 0,
    dropship_min_qty: 1,
    dropship_discount_type: 'percent',
    dropship_discount_value: 0
  });

  // ==========================================
  // STATE & LOGIKA MEDIA LIBRARY (GALERI)
  // ==========================================
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState('gallery');
  
  const [galleryImages] = useState([
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606214174585-fd10f6d8118d?q=80&w=300&auto=format&fit=crop',
  ]);
  
  const [selectedGalleryImg, setSelectedGalleryImg] = useState('');

  const handleSelectFromGallery = () => {
    if (selectedGalleryImg) {
      setFormData({
        ...formData,
        image_url: selectedGalleryImg,
        image_file: null 
      });
      setIsMediaOpen(false);
    }
  };

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const response = await getProductById(id);
        if (response.success) {
          setFormData({
            ...response.data,
            is_active: parseInt(response.data.is_active || 0),
            is_affiliate_enabled: parseInt(response.data.is_affiliate_enabled || 0),
            commission_type: response.data.commission_type || 'percent',       // 👈 Ambil data tipe komisi
            commission_value: parseFloat(response.data.commission_value || 0), // 👈 Ambil data nilai komisi
            // Data baru
            weight: parseInt(response.data.weight || 1000),
            length: parseInt(response.data.length || 10),
            width: parseInt(response.data.width || 10),
            height: parseInt(response.data.height || 10),
            is_dropship_enabled: parseInt(response.data.is_dropship_enabled || 0),
            dropship_min_qty: parseInt(response.data.dropship_min_qty || 1),
            dropship_discount_type: response.data.dropship_discount_type || 'percent',
            dropship_discount_value: parseFloat(response.data.dropship_discount_value || 0),
          });
        } else {
          toast.error("Produk tidak ditemukan!");
          navigate("/product");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Gagal memuat data produk.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("category", formData.category);
    payload.append("sku", formData.sku || "");
    payload.append("description", formData.description || "");
    payload.append("price", parseFloat(formData.price) || 0);
    payload.append("is_active", formData.is_active ? 1 : 0);
    
    // 👈 KIRIM PAYLOAD AFILIASI BARU
    payload.append("is_affiliate_enabled", formData.is_affiliate_enabled ? 1 : 0);
    payload.append("commission_type", formData.commission_type);
    payload.append("commission_value", parseFloat(formData.commission_value) || 0);

    // Dimensions & Dropship
    payload.append('weight', parseInt(formData.weight) || 1000);
    payload.append('length', parseInt(formData.length) || 10);
    payload.append('width', parseInt(formData.width) || 10);
    payload.append('height', parseInt(formData.height) || 10);
    payload.append('is_dropship_enabled', formData.is_dropship_enabled ? 1 : 0);
    payload.append('dropship_min_qty', parseInt(formData.dropship_min_qty) || 1);
    payload.append('dropship_discount_type', formData.dropship_discount_type);
    payload.append('dropship_discount_value', parseFloat(formData.dropship_discount_value) || 0);
    
    payload.append("_method", "PUT");

    if (formData.image_file) {
      payload.append("image_file", formData.image_file);
    } else if (formData.image_url) {
      payload.append("image_url", formData.image_url);
    }

    try {
      const response = await updateProduct(id, payload);
      if (response.success) {
        toast.success("Produk berhasil diupdate!");
        navigate("/product");
      } else {
        toast.error("Gagal update: Cek form kembali");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#1a1e1a] gap-4 transition-colors">
        <Loader2 className="animate-spin text-[#E65100]" size={40} />
        <p className="text-slate-400 dark:text-slate-500 font-bold animate-pulse uppercase text-[10px] tracking-widest">
          Sinking Data...
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-[#F8FAFC] dark:bg-[#1a1e1a] min-h-screen font-sans relative transition-colors">
      
      {/* --- MEDIA LIBRARY MODAL --- */}
      {isMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1d1a] w-full max-w-4xl h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border dark:border-slate-800/50">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/50">
              <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <ImageIcon className="text-[#E65100]" /> Media Library
              </h2>
              <button onClick={() => setIsMediaOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-8 px-8 pt-4 border-b border-slate-100 dark:border-slate-800/50">
              <button 
                onClick={() => setMediaTab('gallery')}
                className={`pb-4 text-sm font-black uppercase tracking-widest border-b-2 transition-all ${mediaTab === 'gallery' ? 'border-[#E65100] text-[#E65100]' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <span className="flex items-center gap-2"><Grid size={16} /> Galeri KAMBI</span>
              </button>
              <button 
                onClick={() => setMediaTab('upload')}
                className={`pb-4 text-sm font-black uppercase tracking-widest border-b-2 transition-all ${mediaTab === 'upload' ? 'border-[#E65100] text-[#E65100]' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                <span className="flex items-center gap-2"><UploadCloud size={16} /> Upload Baru</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-[#1a1d1a]">
              {mediaTab === 'gallery' ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedGalleryImg(img)}
                      className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedGalleryImg === img ? 'border-[#E65100] shadow-lg shadow-orange-500/30 scale-95' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
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
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] bg-white dark:bg-[#2a2d2a] relative hover:border-orange-300 dark:hover:border-orange-900/50 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all">
                  <UploadCloud size={60} className="text-slate-300 dark:text-slate-500 mb-4" />
                  <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-2">Tarik dan Lepas gambar di sini</h3>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-6">atau klik tombol di bawah (Max 2MB)</p>
                  <label className="px-8 py-3 bg-[#1E293B] dark:bg-white text-white dark:text-black rounded-xl font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-slate-900/20 dark:shadow-none">
                    Pilih File Gambar
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              )}
            </div>

            {mediaTab === 'gallery' && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#1a1d1a] flex justify-end gap-3">
                <button onClick={() => setIsMediaOpen(false)} className="px-6 py-3 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">Batal</button>
                <button 
                  onClick={handleSelectFromGallery}
                  disabled={!selectedGalleryImg}
                  className="px-8 py-3 bg-[#E65100] text-white font-black uppercase tracking-widest text-xs rounded-xl disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 dark:shadow-none"
                >
                  Gunakan Gambar Ini
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- END MEDIA LIBRARY MODAL --- */}

      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 dark:bg-[#1a1e1a]/80 backdrop-blur-md py-4 transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/product")}
            className="p-2.5 bg-white dark:bg-[#2a2d2a] border border-slate-200 dark:border-transparent rounded-2xl text-slate-400 hover:text-[#E65100] transition-all shadow-sm"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Box size={12} /> ID: {id}
            </div>
            <h1 className="text-2xl font-black text-[#1E293B] dark:text-white transition-colors">
              Edit <span className="text-[#E65100]">Product</span>
            </h1>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/product")}
            className="flex-1 md:flex-none px-6 py-3.5 bg-white dark:bg-[#2a2d2a] text-slate-500 dark:text-slate-400 rounded-2xl font-bold border border-slate-200 dark:border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-10 py-3.5 bg-[#1E293B] dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Updating..."
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* KIRI: DETAIL KONTEN */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#1a1d1a] p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2 mb-8 transition-colors">
              <Info size={16} className="text-[#E65100]" /> Content Editor
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block transition-colors">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-2 border-transparent rounded-2xl text-sm outline-none focus:border-orange-100 dark:focus:border-orange-900/50 focus:bg-white dark:focus:bg-[#333733] transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block transition-colors">
                    SKU Code
                  </label>
                  <div className="relative">
                    <Barcode
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500"
                      size={16}
                    />
                    <input
                      type="text"
                      value={formData.sku || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <textarea
                rows="8"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-6 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-2 border-transparent rounded-[1.5rem] text-sm outline-none focus:border-orange-100 dark:focus:border-orange-900/50 focus:bg-white dark:focus:bg-[#333733] transition-all font-medium leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
              ></textarea>
            </div>
          </div>
        </div>

        {/* KANAN: METADATA & SIDEBAR */}
        <div className="xl:col-span-4 space-y-6">
          {/* HARGA & STOK */}
          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <h3 className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-widest mb-6 flex items-center gap-2 transition-colors">
              <Settings size={16} className="text-[#E65100]" /> Inventory & Shipping
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-[#2a2d2a] p-4 rounded-2xl border border-slate-100 dark:border-transparent transition-colors">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block transition-colors">
                  Harga Jual
                </label>
                <div className="flex items-center gap-2 text-lg font-black dark:text-white transition-colors">
                  <span className="text-slate-300 dark:text-slate-600">Rp</span>
                  <input
                    type="text"
                    value={formatPrice(formData.price || "")}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseNumber(e.target.value) })
                    }
                    className="bg-transparent w-full outline-none"
                  />
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 dark:bg-[#2a2d2a] p-3 rounded-2xl border border-slate-100 dark:border-transparent transition-colors">
                    <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block transition-colors">Berat (Gram)</label>
                    <input type="text" value={formatNumber(formData.weight)} onChange={(e) => setFormData({...formData, weight: parseNumber(e.target.value)})} className="bg-transparent w-full outline-none text-sm font-bold dark:text-white" placeholder="1,000" />
                 </div>
                 <div className="bg-slate-50 dark:bg-[#2a2d2a] p-3 rounded-2xl border border-slate-100 dark:border-transparent transition-colors">
                    <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block transition-colors">Panjang (cm)</label>
                    <input type="text" value={formatNumber(formData.length)} onChange={(e) => setFormData({...formData, length: parseNumber(e.target.value)})} className="bg-transparent w-full outline-none text-sm font-bold dark:text-white" placeholder="10" />
                 </div>
                 <div className="bg-slate-50 dark:bg-[#2a2d2a] p-3 rounded-2xl border border-slate-100 dark:border-transparent transition-colors">
                    <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block transition-colors">Lebar (cm)</label>
                    <input type="text" value={formatNumber(formData.width)} onChange={(e) => setFormData({...formData, width: parseNumber(e.target.value)})} className="bg-transparent w-full outline-none text-sm font-bold dark:text-white" placeholder="10" />
                 </div>
                 <div className="bg-slate-50 dark:bg-[#2a2d2a] p-3 rounded-2xl border border-slate-100 dark:border-transparent transition-colors">
                    <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block transition-colors">Tinggi (cm)</label>
                    <input type="text" value={formatNumber(formData.height)} onChange={(e) => setFormData({...formData, height: parseNumber(e.target.value)})} className="bg-transparent w-full outline-none text-sm font-bold dark:text-white" placeholder="10" />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1d1a] p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800/50 transition-colors">
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2 transition-colors">
                  <Layers size={12} /> Category
                </label>
                <select
                  value={formData.category || "Bubuk Premium"}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 dark:bg-[#2a2d2a] dark:text-white border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer transition-colors"
                >
                  <option value="Bubuk Premium">Bubuk Premium</option>
                  <option value="Herbal Spesial">Herbal Spesial</option>
                  <option value="Paket Keluarga">Paket Keluarga</option>
                  <option value="Perawatan Tubuh">Perawatan Tubuh</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1d1a] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 flex items-center justify-between transition-colors">
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Visibility</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
                {formData.is_active ? "Published" : "Draft"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  is_active: formData.is_active ? 0 : 1,
                })
              }
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.is_active ? "bg-green-500 dark:bg-green-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${formData.is_active ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
          </div>

          {/* AFILIASI TOGGLE & PENGATURAN KOMISI */}
          <div className="bg-white dark:bg-[#1a1d1a] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black text-purple-400 dark:text-purple-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                  🔥 Program Afiliasi
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
                  {formData.is_affiliate_enabled ? 'Aktif di Bursa' : 'Tidak Aktif'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, is_affiliate_enabled: formData.is_affiliate_enabled ? 0 : 1})}
                className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.is_affiliate_enabled ? 'bg-purple-500 dark:bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${formData.is_affiliate_enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Jika Afiliasi Aktif, Munculkan Opsi Tipe & Nilai Komisi */}
            {formData.is_affiliate_enabled ? (
               <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 mt-4 animate-in slide-in-from-top-2 duration-300 space-y-4">
                 
                 {/* Input Tipe Komisi */}
                 <div>
                   <label className="text-[9px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-2 block">
                     Tipe Komisi
                   </label>
                   <select 
                     value={formData.commission_type}
                     onChange={(e) => setFormData({...formData, commission_type: e.target.value, commission_value: ''})}
                     className="w-full p-3 bg-white dark:bg-[#1a1d1a] border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500/20 text-purple-700 dark:text-purple-300"
                   >
                     <option value="percent">Persentase (%)</option>
                     <option value="fixed">Nominal Fix (Rp)</option>
                   </select>
                 </div>

                 {/* Input Nilai Komisi */}
                 <div>
                   <label className="text-[9px] font-black text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-2 block">
                     Nilai Komisi
                   </label>
                   <div className="flex items-center gap-2 text-lg font-black dark:text-white bg-white dark:bg-[#1a1d1a] border border-purple-200 dark:border-purple-800 rounded-xl p-3">
                     {formData.commission_type === 'fixed' && <span className="text-purple-400 dark:text-purple-600 text-sm">Rp</span>}
                     <input 
                       type="text" 
                       value={formData.commission_type === 'fixed' ? formatPrice(formData.commission_value || "") : formatNumber(formData.commission_value || "")} 
                       onChange={(e) => setFormData({...formData, commission_value: parseNumber(e.target.value)})} 
                       className="bg-transparent w-full outline-none text-purple-700 dark:text-purple-300 placeholder:text-purple-300/50 text-sm" 
                       placeholder={formData.commission_type === 'percent' ? "Contoh: 15" : "Contoh: 20.000"}
                     />
                     {formData.commission_type === 'percent' && <span className="text-purple-400 dark:text-purple-600 text-sm">%</span>}
                   </div>
                 </div>

               </div>
            ) : null}
          </div>
          {/* END AFILIASI TOGGLE */}

          {/* DROPSHIP TOGGLE & PENGATURAN DISKON */}
          <div className="bg-white dark:bg-[#1a1d1a] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                  📦 Program Dropship
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">
                  {formData.is_dropship_enabled ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, is_dropship_enabled: formData.is_dropship_enabled ? 0 : 1})}
                className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${formData.is_dropship_enabled ? 'bg-blue-500 dark:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${formData.is_dropship_enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Jika Dropship Aktif */}
            {formData.is_dropship_enabled ? (
               <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/50 mt-4 animate-in slide-in-from-top-2 duration-300 space-y-4">
                 
                 {/* Min Qty Dropship */}
                 <div>
                    <label className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2 block">Minimal Pembelian</label>
                    <input type="text" value={formatNumber(formData.dropship_min_qty)} onChange={(e) => setFormData({...formData, dropship_min_qty: parseNumber(e.target.value)})} className="w-full p-3 bg-white dark:bg-[#1a1d1a] border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold outline-none text-blue-700 dark:text-blue-300" placeholder="1" />
                 </div>

                 {/* Tipe Diskon Dropship */}
                 <div>
                   <label className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2 block">Tipe Diskon Dropship</label>
                   <select 
                     value={formData.dropship_discount_type}
                     onChange={(e) => setFormData({...formData, dropship_discount_type: e.target.value})}
                     className="w-full p-3 bg-white dark:bg-[#1a1d1a] border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold outline-none text-blue-700 dark:text-blue-300"
                   >
                     <option value="percent">Persentase (%)</option>
                     <option value="fixed">Nominal Fix (Rp)</option>
                   </select>
                 </div>

                 {/* Nilai Diskon Dropship */}
                 <div>
                    <label className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2 block">Nilai Diskon</label>
                    <div className="flex items-center gap-2 bg-white dark:bg-[#1a1d1a] border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                       {formData.dropship_discount_type === 'fixed' && <span className="text-blue-400 text-sm">Rp</span>}
                       <input type="text" value={formData.dropship_discount_type === 'fixed' ? formatPrice(formData.dropship_discount_value) : formatNumber(formData.dropship_discount_value)} onChange={(e) => setFormData({...formData, dropship_discount_value: parseNumber(e.target.value)})} className="bg-transparent w-full outline-none text-blue-700 dark:text-blue-300 font-bold text-sm" placeholder="0" />
                       {formData.dropship_discount_type === 'percent' && <span className="text-blue-400 text-sm">%</span>}
                    </div>
                 </div>

               </div>
            ) : null}
          </div>
          {/* END DROPSHIP TOGGLE */}

          {/* TOMBOL BUKA MEDIA LIBRARY */}
          <div className="bg-[#1E293B] dark:bg-[#2a2d2a] p-8 rounded-[3rem] shadow-2xl dark:shadow-none text-white relative transition-colors">
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