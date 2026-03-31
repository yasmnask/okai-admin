import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Image as ImageIcon, Box, 
  Info, Settings, Eye, HelpCircle, Barcode, Layers, MapPin
} from 'lucide-react';
import { addProduct } from '../services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State terintegrasi dengan kolom baru DB: sku, category, warehouse
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronic',
    warehouse: 'Gudang Utama (Surabaya)',
    description: '',
    price: '',
    stock: 0,
    image_url: '',
    is_active: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Konversi tipe data agar sesuai validasi Laravel
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      is_active: formData.is_active ? 1 : 0
    };

    try {
      const response = await addProduct(payload);
      if(response.success || response.id) {
        navigate('/product');
      } else {
        alert("Gagal simpan: " + JSON.stringify(response.errors || "Cek validasi server"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* STICKY HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/product')} className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#E65100] transition-all">
            <ArrowLeft size={22} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#E65100] uppercase tracking-[0.2em]">
              <Box size={12} /> OKAI Systems
            </div>
            <h1 className="text-2xl font-black text-[#1E293B]">Publish <span className="text-[#E65100]">New Item</span></h1>
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
                    placeholder="Contoh: Sepatu Pro Running v2" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">SKU Code</label>
                  <div className="relative">
                    <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20" 
                      placeholder="OK-001" 
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
                  placeholder="Ceritakan keunggulan produk kamu..."
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
                  <span className="text-[10px] text-slate-300 uppercase">Unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* KLASIFIKASI (KATEGORI & GUDANG) */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Layers size={12} /> Category
                </label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer text-slate-700"
                >
                  <option value="Electronic">Electronic</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
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

          {/* IMAGE PREVIEW */}
          <div className="bg-[#1E293B] p-8 rounded-[3rem] shadow-2xl text-white">
            <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-500 mb-6 flex items-center gap-2">
              <ImageIcon size={14} className="text-[#E65100]" /> Product Image
            </h3>
            <div className="space-y-4">
              <div className="w-full aspect-square bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-20">
                    <ImageIcon size={32} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase">No Image</p>
                  </div>
                )}
              </div>
              <input 
                type="text" 
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] outline-none font-mono" 
                placeholder="Paste Image URL..." 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}