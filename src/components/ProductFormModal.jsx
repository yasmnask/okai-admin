import React, { useState } from 'react';
import { X, Save, Loader2, Package } from 'lucide-react';
import { addProduct } from '../services/api';

export default function ProductFormModal({ isOpen, onClose, onRefresh }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    image_url: '',
    is_active: 1
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addProduct(formData);
      setFormData({ name: '', description: '', price: '', stock: 0, image_url: '', is_active: 1 });
      onRefresh(); // Panggil fungsi refresh di parent
      onClose(); // Tutup modal
    } catch (error) {
      alert("Gagal simpan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        {/* MODAL HEADER */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-[#E65100] rounded-xl"><Package size={20}/></div>
            <h3 className="font-black text-[#1E293B] text-xl uppercase tracking-tight">Add <span className="text-[#E65100]">New Product</span></h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
        </div>
        
        {/* MODAL FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" placeholder="Nama Produk PT Otak Kanan" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (IDR)</label>
              <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" placeholder="0" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
              <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
            <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 font-bold" placeholder="https://image-link.com" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea rows="2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 font-medium" placeholder="Deskripsi singkat produk..."></textarea>
          </div>
          
          <button disabled={isSubmitting} className="w-full mt-4 bg-[#E65100] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-orange-100 flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            Save to Database
          </button>
        </form>
      </div>
    </div>
  );
}